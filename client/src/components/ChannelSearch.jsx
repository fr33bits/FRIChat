import React, { useState, useEffect } from 'react'
import { useChatContext } from 'stream-chat-react'

import ResultsDropdown from './ResultsDropdown.jsx'

import {SearchIcon} from '../assets'

const ChannelSearch = ({ setToggleContainer }) => {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)

    const { client, setActiveChannel } = useChatContext()
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    useEffect(() => { // function is called every time the query changes
        if (!query) { // if the query changes and there is no query
            // clearing the channel list by setting them to empty arrays
            setTeamChannels([])
            setDirectChannels([])
        }
    }, [query]) // this is a dependency array
    
    const getChannels = async (text) => { // async, ker je potrebno počakati, da se pridobijo kanali; text = query
        try {
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text }, // autocompleting all the username
                members: { $in: [client.userID] }
            })

            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }, // autocompleting all the username
            })

            // we use a Promise.all because we want to start fetching them at the same time instead of putting an await in front of client.queryChannels and client.queryUsers, which would mean that one would have to be fetched after the other
            const [channels, { users }] = await Promise.all([channelResponse, userResponse])


            if (channels.length) { // if there are any channels
                setTeamChannels(channels)
            }
            if (users.length) { // if there are any users
                setDirectChannels(users) // "if you think about it, a direct channel is nothing more than a user"
            }
        } catch (err) {
            setQuery('')
        }
    }

    const onSearch = (event) => {
        event.preventDefault() // potrebno za vse gumbe in vnosna polja, ker je privzeto obnašanje brskalnika, da vsakič ko pritisneš submit se stran ponovno naloži

        setLoading(true)
        setQuery(event.target.value) // TODO: throws error when searching, but didn't in video
        getChannels(event.target.value)
    }

    const setChannel = (channel) => {
        setQuery("")
        setActiveChannel(channel)
    }

  return (
    <div className='channel-search__container'>
        <div className='channel-search__input__wrapper'>
            <div className='channel-search__input__icon'>
                <SearchIcon/>
            </div>
            <input
                className='channel-search__input__text'
                type="text"
                placeholder='Search'
                value={query}
                onChange={onSearch}
            />
        </div>
        {
            query && ( // if a query exists
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )
        }
    </div>
  )
}

export default ChannelSearch