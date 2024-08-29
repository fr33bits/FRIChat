import React from 'react'

import { AddChannel } from '../assets'

import '../styles/ChatList.css'

const ChatListItems = ({ children }) => {
    if (!children.props.children) {
        return (
            <p className='chat_list-header-message'>Ni kanalov</p>
        )
    } else {
        return (
            <div>
                { children }
            </div>
        )
    }
}

const ChatList = (
    { children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }
) => { // vse React komponente imajo children property
    if (error) {
        return type === 'team' ? (
            <div className='chat_list'>
                <div className='chat_list-header'>
                    <p className='chat_list-header-title'>
                        {type === 'team' ? 'Kanali' : 'Neposredna sporočila'}
                    </p>
                    <div>
                        <p className='chat_list-header-message'>
                            Napaka s povezavo. Prosimo poskusite kasneje.
                        </p>
                    </div>
                </div>
            </div>
        ) : null
    }

    if (loading) {
        return (
            <div className='chat_list'>
                <div className='chat_list-header'>
                    <p className='chat_list-header-title'>
                        {type === 'team' ? 'Kanali' : 'Neposredna sporočila'}
                    </p>
                </div>
                <div>
                    <p className='chat_list-header-message loading'>
                        Nalaganje {type === 'team' ? 'kanalov' : 'sporočil'}...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='chat_list'>
            <div className='chat_list-header'>
                <p className='chat_list-header-title'>
                    {type === 'team' ? 'Kanali' : 'Neposredna sporočila'}
                </p>
                {/* The AddChannel SVG already has on-click properties */}
                <AddChannel
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            {/* prikažemo podane otroke */}
            <ChatListItems
                children={children}
            />
        </div>
    )
}

export default ChatList