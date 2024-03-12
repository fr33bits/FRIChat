import React from 'react'

import { AddChannel }  from '../assets'

const TeamChannelList = (
        { children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }
    ) => { // props: vse React komponente imajo children property; type: group chat or regular messages
    if (error) {
        return type === 'team' ?  (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    Napaka s povezavo. Prosimo poskusite kasneje.
                </p>
            </div>
        ) : null
    }

    if (loading) {
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message loading'>
                    Nalaganje { type === 'team' ? 'kanalov' : 'sporočil'}...
                </p>
            </div>
        )
    }

    return (
        <div className='team-channel-list'>
            <div className='team-channel-list__header'>
                <p className='team-channel-list__header__title'>
                    { type === 'team' ? 'Kanali' : 'Neposredna sporočila'}
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
            { children }
        </div>
    )
}

export default TeamChannelList