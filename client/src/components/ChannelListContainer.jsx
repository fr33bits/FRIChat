import React, { useState } from 'react'
import { ChannelList, useChat, useChatContext } from 'stream-chat-react'
import Cookies from 'universal-cookie'

import ChannelSearch from './ChannelSearch' 
import TeamChannelList from './TeamChannelList' 
import TeamChannelPreview from './TeamChannelPreview'
import Logo from '../assets/logo.png'
import LogoutIcon from '../assets/logout.png'

const cookies = new Cookies()

const SideBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={Logo} alt="FRIChat logo" width="30"/>
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Odjava" width="30"/>
            </div>
        </div>
    </div>
)

const Header = ({ logout }) => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">FRIChat</p>
    </div>
)

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team')
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging')
}


const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => { // TODO: but isCreating was not passed at the bottom?
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
        <SideBar logout={logout}/>
        <div className="channel-list__list__wrapper">
            <Header/>
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

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false)

    return (
        <>
            {/* Desktop: */}
            <div className='channel-list__container'>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />
            </div>
            {/* Mobile: */}
            <div
                className='channel-list__container-responsive'
                style={{left: toggleContainer ? '0%' : '-89%', background: "#005fff"}}
            >
                <div
                    className='channel-list__container-toggle'
                    onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}
                >
                </div>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    )
}

export default ChannelListContainer