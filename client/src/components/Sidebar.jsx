import React, { useState } from 'react'
import { ChannelList, useChat, useChatContext } from 'stream-chat-react'
import Cookies from 'universal-cookie'

import ChannelSearch from './ChannelSearch' 
import ChatList from './ChatList' 
import ChatPreview from './ChatPreview'
import SettingsIcon from '../assets/settings.png'
import LogoutIcon from '../assets/logout.png'

import './Sidebar.css'

const cookies = new Cookies()

const Header = ({ logout }) => (
    <div className="sidebar-header">
        <div className="sidebar-header-service-name-text">FRIChat</div>
        <div className="sidebar-header-button">
            <div className="sidebar-header-button-icon">
                <img src={SettingsIcon} alt="Nastavitve" width="25"/>
            </div>
        </div>
        <div className="sidebar-header-button">
            <div className="sidebar-header-button-icon" onClick={logout}>
                <img src={LogoutIcon} alt="Odjava" width="23"/>
            </div>
        </div>
    </div>
)

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team')
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging')
}

const SidebarContainer = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => { // TODO: but isCreating was not passed at the bottom?
    const { client } = useChatContext()

    const logout = () => {
        cookies.remove('token');
        cookies.remove('token');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('userID');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');

        window.location.reload() // ponovno nalaganje strani, da pridemo do prijavne strani
    }

    const filter = { members: { $in: [client.userID] } } // all channels and direct messages where the client user is included

  return (
    <>
        <div className="sidebar-wrapper">
            <Header logout={logout}/>
            <ChannelSearch setToggleContainer={setToggleContainer} />

            {/* List uporablja za prikazovanje zaželjenga seznama; znotraj specifiramo callback funkcijo, ki vrne komponento, ki jo želimo */}
            {/* StreamAPI nam pomaga, ker imamo že narejeno funkcijo s kanali  */}
            <ChannelList
                filters={filter}
                channelRenderFilterFn={customChannelTeamFilter}
                List={(listProps) => (
                    <ChatList
                        { ...listProps} // custom component ChatList will get all the props that the components ChannelList would usually get using stream
                        type='team'
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                    
                )}
                Preview={(previewProps) => (
                    <ChatPreview
                        { ...previewProps }
                        type='team'
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
            />
            <ChannelList // for non-group chats
                filters={filter}
                channelRenderFilterFn={customChannelMessagingFilter}
                List={(listProps) => (
                    <ChatList
                        { ...listProps} // custom component ChatList will get all the props that the components ChannelList would usually get using stream
                        type='messaging'
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <ChatPreview
                        { ...previewProps }
                        type='messaging'
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
            />
        </div>
    </>
  )
}

const Sidebar = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false)

    return (
        <>
            {/* Desktop: */}
            <div className='sidebar-container'>
                <SidebarContainer
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
            </div>
            {/* Mobile: */}
            <div
                className='sidebar-container-responsive'
                style={{left: toggleContainer ? '0%' : '-89%', background: "#005fff"}}
            >
                <div
                    onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}
                >
                </div>
                <SidebarContainer
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    )
}

export default Sidebar