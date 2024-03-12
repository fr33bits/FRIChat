import React from 'react'
import { Channel, useChatContext, MessageSimple } from 'stream-chat-react'

import ChannelInner from './ChannelInner.jsx'
import CreateChannel from './CreateChannel.jsx'
import EditChannel from './EditChannel.jsx'
// import TeamMessage from './TeamMessage.jsx'

const ChannelContainer = ({ isCreating, setIsCreating, editing, setIsEditing, createType, setCreateType }) => {
  const { channel } = useChatContext() // pridobimo podatke o specifičnem kanalu

  if (isCreating) { // če se kanal trenutno ustvarja
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating}/>
      </div>
    )
  }

  if (editing) { // če se kanal urejuje
    return (
      <EditChannel setIsEditing={setIsEditing}/>
    )
  }

  const EmptyState = () => { // chat with 0 messages
    <div className='channel-empty__container'>
      <p className='channel-empty__first'>Pogovor je prazen. Pošljite kakšno sporočilo!</p>
    </div>
  }

  return (
    <div className='channel__container'>
      <Channel EmptyStateIndicator={EmptyState} Message={(messageProps, i) => <MessageSimple key={i} { ...messageProps}/>}>
        <ChannelInner setIsEditing={setIsEditing}/>
      </Channel>
    </div>
  )
}

export default ChannelContainer