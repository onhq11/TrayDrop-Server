import mongodb from 'mongodb'
import { sendLog } from "../../logs.js"

export let client

export const configMDB = async () => {
    let out = {
        error: null
    }

    client = new mongodb.MongoClient(process.env.DATABASE_URL)

    try {
        let temp = []

        const database = client.db('traydrop')
        const data = database.collection('users')

        const userData = data.find()

        await userData.forEach(doc => {
            temp.push(doc)
        })

        sendLog('mongodb', 'Database connected successfully')
    } catch(err) {
        sendLog('mongodb', `Cannot connect to database: \n ${err}`, 2)
        out.error = true
    }

    return out
}