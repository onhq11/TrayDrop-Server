import { client } from "./config.js"

export const registerUser = async (username, password, secret) => {
    let out = {
        result: [],
        error: null
    }

    try {
        const database = client.db('traydrop')
        const data = database.collection('users')

        const users = data.find()
        
        let usersList = []
        await users.forEach(doc => {
            usersList.push(doc)
        })

        for(let i=0; i<usersList.length; i++) {
            if(usersList[i].user == username) {
                out.error = 'Username already exists:'
                return
            }
        }

        data.insertOne({"user": username, "password": password, "secret": secret, "cbText": "", "cbDate": new Date()})
    } catch(err) {
        out.error = `Cannot insert user data: \n ${err}`
    } finally {
        return out
    }
}

export const changePassword = async (username, password, secret) => {
    let out = {
        result: [],
        error: null
    }

    try {
        const database = client.db('traydrop')
        const data = database.collection('users')

        data.updateOne({"user": username}, {$set: {"password": password, "secret": secret}})
    } catch(err) {
        out.error = `Cannot insert user data: \n ${err}`
    } finally {
        return out
    }
}

export const removeAccount = async (username) => {
    let out = {
        result: [],
        error: null
    }

    try {
        const database = client.db('traydrop')
        const data = database.collection('users')

        data.deleteOne({"user": username})
    } catch(err) {
        out.error = `Cannot insert user data: \n ${err}`
    } finally {
        return out
    }
}

export const getUsers = async () => {
    let out = {
        result: [],
        error: null
    }

    try {
        const database = client.db('traydrop')
        const data = database.collection('users')

        const userData = data.find()

        await userData.forEach(doc => {
            out.result.push(doc)
        })
    } catch(err) {
        out.error = `Cannot get users: \n ${err}`
    } finally {
        return out
    }
}

export const setNewClipboard = async (text, date, username) => {
    let out = {
        result: [],
        error: null
    }

    try {
        const database = client.db('traydrop')
        const data = database.collection('users')

        data.updateOne({'user': username}, {$set: {"cbText": text, "cbDate": date}})
    } catch(err) {
        out.error = `Cannot set new clipboard content: \n ${err}`
    } finally {
        return out
    }
}