const { connect } = require('getstream')
const bcrypt = require('bcrypt')
const StreamChat = require('stream-chat').StreamChat
const crypto = require('crypto')

require('dotenv').config()

const api_key = process.env.STREAM_API_KEY
const api_secret = process.env.STREAM_API_SECRET
const app_id = process.env.STREAM_APP_ID

const signup = async (req, res) => { // async potreben, ker je znotraj uporabljen await
    try {
        const { fullName, username, password } = req.body // TODO: avatarURL?

        const userID = crypto.randomBytes(16).toString('hex')
        const serverClient = connect(api_key, api_secret, app_id)
        
        const hashedPassword = await bcrypt.hash(password, 10) // 10 je število krogov soljenja

        const token = serverClient.createUserToken(userID)
        
        // TODO: NONE OF THIS IS BEING STORED as far as I can tel
        res.status(200).json({ token, fullName, username, userID, hashedPassword }) // TODO: avatarURL?
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const serverClient = connect(api_key, api_secret, app_id)
        const client = StreamChat.getInstance(api_key, api_secret)

        const { users } = await client.queryUsers({ name: username })
        if (users.length === 0) return res.status(400).json({ message: "Uporabnik s tem uporabniškim imenom ne obstaja"})

        const success = await bcrypt.compare(password, users[0].hashedPassword)
        
        const token = serverClient.createUserToken(users[0].id)

        if (success) {
            res.status(200).json({ token, fullName: users[0]. fullName, username, userID: users[0].id})
        } else {
            res.status(500).json({ message: "Vnešeno geslo je napačno"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

module.exports = {
    signup,
    login
}