import bodyParser from 'body-parser'
import express from 'express'

import { sendLog } from '../logs.js'
import { requestsWS } from './requests.js'

export const app = express()

export const configWS = () => {
    sendLog('webserver', 'Starting in progress...')
        
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