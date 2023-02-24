import mongodb from 'mongodb'
import { sendLog } from "../../logs.js"

export let client

export const configMDB = () => {
    client = new mongodb.MongoClient(process.env.DATABASE_URL)
    sendLog('mongodb', 'Database connected successfully')
}