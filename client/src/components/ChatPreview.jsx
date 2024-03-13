import React from 'react'
import { AllowAll } from 'stream-chat';
import { Avatar, useChatContext } from 'stream-chat-react'

const ChatPreview = ({ setIsCreating, setIsEditing, channel, type, setToggleContainer, setActiveChannel }) => {
    const { channel: activeChannel, client } = useChatContext();

    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {channel?.data?.name || channel?.data?.id}
        </p>
    )

    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter( // users keyed (using IDs) to a JS object; Object.values vrne le vrednosti brez ID-jev
            ({ user }) => user.id !== client.userID
        )

        return (
            <div className='channel-preview__item single'>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
    }

  return (
    <div
        className={channel?.id === activeChannel?.id
            ? 'channel-preview__wrapper__selected'
            : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false)
            setIsEditing(false)
            setActiveChannel(channel)
            
            if (setToggleContainer) { // necessary because on desktop devices we won't have this toggleContainer
                setToggleContainer((prevState) => !prevState)
            }
        }}
    >
        { type === 'team' ?  <ChannelPreview/> : <DirectPreview/> }
    </div>
  )
}

export default ChatPreview