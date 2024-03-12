import React, { useState } from 'react'
import { ChannelList, useChat, useChatContext } from 'stream-chat-react'
import Cookies from 'universal-cookie'

import ChannelSearch from './ChannelSearch' 
import TeamChannelList from './TeamChannelList' 
import TeamChannelPreview from './TeamChannelPreview'
import LogoutIcon from '../assets/logout.png'

import './Sidebar.css'

const cookies = new Cookies()

const Header = ({ logout }) => (
    <div className="sidebar-header">
        <div className="sidebar-header-service-name-text">FRIChat</div>
        <div className="sidebar-header-logout-icon">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Odjava" width="30"/>
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
                    <TeamChannelList
                        { ...listProps} // custom component TeamChannelList will get all the props that the components ChannelList would usually get using stream
                        type='team'
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                    
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview
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
                    <TeamChannelList
                        { ...listProps} // custom component TeamChannelList will get all the props that the components ChannelList would usually get using stream
                        type='messaging'
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview
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