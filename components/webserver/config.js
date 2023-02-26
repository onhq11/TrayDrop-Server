import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'

import { sendLog } from '../logs.js'
import { requestsWS } from './requests.js'
import { configMDB } from '../databases/mongodb/config.js'

export const app = express()

export const configWS = async () => {
    sendLog('webserver', 'Starting in progress...')

    let criticalErr = false

    switch(process.env.DATABASE_TYPE) {
        case 'mongodb':
            await configMDB().then(res => { if(res.error) { criticalErr = true } })
            break
    }

    if(criticalErr) {
        return
    }
        
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.listen(process.env.WEBSERVER_PORT, (err) => {
        if(err) sendLog('webserver', `Cannot start: \n\n${err}`, 2)

        sendLog('webserver', 'Successfully started web server')
        requestsWS()
    })
}