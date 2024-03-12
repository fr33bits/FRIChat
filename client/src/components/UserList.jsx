import React, { useEffect, useState } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

import { InviteIcon } from '../assets'

const ListContainer = ({ children }) => { // React functional component: all of them have access to the children (all components rendered inside it) prop
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        if (selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected) // modifying something by the previous value
    }

    return (
        <div className='user-item__wrapper' onClick={handleSelect}>
            <div className='user-item__name-wrapper'>
                <Avatar  image={user.image} name={user.fullName || user.id} size={32} />
                <p className='user-item__name'>{user.fullName || user.id}</p>
            </div>
            {selected
                ? <InviteIcon/>
                : <div className='user-item__invite-empty'></div> /* empty checkbox: */
            }
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {
    const { client } = useChatContext()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [listEmpty, setListEmpty] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => { // hook to be called when filters (DM vs. channel) change
      const getUsers = async () => {
        if (loading) return

        setLoading(true)
        try {
            // pridobivanje seznama uporabnikov
            const response = await client.queryUsers(
                {
                    id: { $ne: client.userID } // exclude querying of users for user with the current ID (client user)
                    // TODO: NOTE TO SELF
                },
                {
                    id: 1 // a way of sorting
                },
                {
                    limit: 8 // limited to 8 users
                }
            )

            if (response.users.length) {
                setUsers(response.users)
            } else {
                setListEmpty(true)
            }
        } catch (error) {
            console.log(error)
            setError(true)
        }
        setLoading(false)
      }

      if (client) { // sproži le, če je odjemalec povezan
        getUsers()
      }
    }, []) // used to have filters in here but were removed because they are not needed for filtering between DMs and channels
    
    // based on these conditions if there is an error the list container should not be redered

    if (error) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    Error loading, please refresh and try again
                </div>
            </ListContainer>
        )
    }

    if (listEmpty) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    No users found
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading
                ? <div className='user-list__message'>Loading users...</div> 
                : (
                    users?.map((user, i) => (
                        <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                    ))
                )
        }
        </ListContainer>
    )
}

export default UserList