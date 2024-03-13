import React, { useState } from 'react'
import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import Cookies from 'universal-cookie'

import './app.css'
import 'stream-chat-react/dist/css/index.css' // using their CSS for prebuilt components

// komponente
import Sidebar from './components/Sidebar.jsx'
import ChannelContainer from './components/ChannelContainer.jsx'
import ChannelSearch from './components/ChannelSearch.jsx'
import ChatList from './components/ChatList'
import Auth from './components/Auth.jsx'
import ChannelInner from './components/ChannelInner.jsx'
import CreateChannel from './components/CreateChannel.jsx'
import EditChannel from './components/EditChannel.jsx'
// import TeamMessage from './components/TeamMessage.jsx'
import UserList from './components/UserList.jsx'

const cookies = new Cookies()

const apiKey = 'aqgsrwcbfxtr'
const authToken = cookies.get('token'); // pridobimo ob prijavi

const client = StreamChat.getInstance(apiKey) // ustvari client instance

if (authToken) {
    client.connectUser({ // če uporabnik ne obstaja, ga ta funkcija tudi ustvari
        token: cookies.get('token'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        id: cookies.get('userID'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
    }, authToken) 
}

const App = () => {
    // ta stanja je potrebno vedeti v več komponentah (ChannelListContainer in ChannelContainer)
    const [createType, setCreateType] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [editing, setIsEditing] = useState('')

    if (!authToken) {
        return <Auth/>
    } else {
        return ( // prikaže, če smo že prijavljeni
            <div className="app__wrapper">
                <Chat client={client} theme="team light">
                    <Sidebar
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType}
                        setIsEditing={setIsEditing}
                    />
                    <ChannelContainer
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        editing={editing}
                        setIsEditing={setIsEditing}
                        createType={createType}
                    />
                </Chat>
            </div>
        )
    }
}

export default App