import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react'

import { CloseCreateChannel } from '../assets'
import UserList from './UserList.jsx'

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    
    const handleChange = (event) => {
        event.preventDefault()

        setChannelName(event.target.value)
    } 

    return (
        <div className='channel-name-input__wrapper'>
            <p>Name</p>
            <input type="text" value={channelName} onChange={handleChange} placeholder='ime-kanala' />
            <p>Dodaj prejemnike</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {
    const [channelName, setChannelName] = useState('')
    const { client, setActiveChannel } = useChatContext()
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']) // at the start we are only picking our own ID because we always want to be in the chats we're creating

    const createChannel = async (event) => {
        event.preventDefault()

        try {
            // createType: messaging or team channel
            const newChannel = await client.channel(createType, channelName, {
                name: channelName,
                members: selectedUsers
            })

            await newChannel.watch()

            setChannelName('') // resets the channel name field
            setIsCreating(false)
            setSelectedUsers([client.userID])
            setActiveChannel(newChannel)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='create-channel__container'>
        <div className='create-channel__header'>
            <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
            <CloseCreateChannel setIsCreating={setIsCreating} />
        </div>
        {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
        <UserList setSelectedUsers={setSelectedUsers} />
        <div className='create-channel__button-wrapper' onClick={createChannel}>
            <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
        </div>
    </div>
  )
}

export default CreateChannel