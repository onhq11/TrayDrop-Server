import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { changePassword, getUsers, registerUser, setNewClipboard, removeAccount } from "../databases/mongodb/requests.js"
import { sendLog } from "../logs.js"
import { generateSecret } from '../secret/secret.js'
import { app } from "./config.js"

export const requestsWS = () => {
    app.post('/ping', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/ping) Received request from {${req.ip}}`, 3)

        res.end(JSON.stringify({"result": "pong"}))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/register', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/register) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            error: null
        }

        let secret = generateSecret()
        let hashedPass = await bcrypt.hashSync(req.body.password, 12)

        if(!hashedPass || !secret) {
            out.error = 'Password encrypt failed'
            sendLog('bcrypt', out.error, 2)

            res.end(JSON.stringify(out))
            return
        }

        let mongoOut = await registerUser(req.body.username, hashedPass, secret)

        if(mongoOut.error) {
            out.error = mongoOut.error.substring(0, mongoOut.error.indexOf(':'))
            sendLog('mongodb', out.error, 2)

            res.end(JSON.stringify(out))
            return
        }
        
        out.result = jwt.sign({ username: req.body.username }, secret)

        if(out.error) {
            sendLog('webserver', `(/register) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully registered, token sent', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/login', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/login) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            error: null
        }

        await getUsers().then(async doc => {
            if(doc.error) {
                sendLog('mongodb', doc.error, 2)

                out.error = doc.error.substring(0, doc.error.indexOf(':'))
                return
            }

            let userIndex
            for(let i=0; i<doc.result.length; i++) {
                if(doc.result[i].user == req.body.username) {
                    userIndex = i
                    break
                }
            }

            if(!userIndex && userIndex !== 0) {
                out.error = 'User not found'
                return
            }

            if(typeof doc.result[userIndex].secret === 'undefined') {
                out.error = 'Account secret not found, please contact with server adminstrator'
                return
            }

            let compare = await bcrypt.compareSync(req.body.password, doc.result[userIndex].password)

            if(compare) {
                out.result = jwt.sign({ username: req.body.username }, doc.result[userIndex].secret)
            } else {
                out.error = 'Invalid password'
                return
            }
        })

        if(out.error) {
            sendLog('webserver', `(/login) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully logged in, token sent', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/changepassword', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/changepassword) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            error: null
        }

        await getUsers().then(async doc => {
            if(doc.error) {
                sendLog('mongodb', doc.error, 2)

                out.error = doc.error.substring(0, doc.error.indexOf(':'))
                return
            }

            let userIndex
            for(let i=0; i<doc.result.length; i++) {
                if(doc.result[i].user === req.body.username) {
                    userIndex = i
                    break
                }
            }

            if(!userIndex && userIndex !== 0) {
                out.error = 'User not found'
                return
            }

            if(typeof doc.result[userIndex].secret === 'undefined') {
                out.error = 'Account secret not found, please contact with server adminstrator'
                return
            }

            let bearerHeader = req.headers.authorization
            if(typeof bearerHeader !== 'undefined') {
                const decoded = jwt.verify(bearerHeader, doc.result[userIndex].secret)
                
                if(typeof decoded.username === 'undefined' || decoded.username != req.body.username) {
                    out.error = `Authentication failed {${req.body.username}}`
                    return
                }

                let compare = await bcrypt.compareSync(req.body.password, doc.result[userIndex].password)

                if(compare) {
                    let secret = generateSecret()
                    let hashedPass = await bcrypt.hashSync(req.body.newpassword, 12)

                    if(!hashedPass || !secret) {
                        out.error = 'Password encrypt failed'
                        sendLog('bcrypt', out.error, 2)

                        res.end(JSON.stringify(out))
                        return
                    }

                    let changed = await changePassword(doc.result[userIndex].user, hashedPass, secret)
                    
                    if(changed.error) {
                        out.error = changed.error.substring(0, changed.error.indexOf(':'))
                        sendLog('mongodb', out.error, 2)
            
                        res.end(JSON.stringify(out))
                        return
                    }

                    out.result = 'Password changed'
                } else {
                    out.error = 'Invalid password'
                    return
                }
            } else {
                out.error = `Authentication failed {${req.body.username}}`
                return
            }
        })

        if(out.error) {
            sendLog('webserver', `(/changepassword) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully changed password', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/removeaccount', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/removeaccount) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            error: null
        }

        await getUsers().then(async doc => {
            if(doc.error) {
                sendLog('mongodb', doc.error, 2)

                out.error = doc.error.substring(0, doc.error.indexOf(':'))
                return
            }

            let userIndex
            for(let i=0; i<doc.result.length; i++) {
                if(doc.result[i].user === req.body.username) {
                    userIndex = i
                    break
                }
            }

            if(!userIndex && userIndex !== 0) {
                out.error = 'User not found'
                return
            }

            if(typeof doc.result[userIndex].secret === 'undefined') {
                out.error = 'Account secret not found, please contact with server adminstrator'
                return
            }

            let bearerHeader = req.headers.authorization
            if(typeof bearerHeader !== 'undefined') {
                const decoded = jwt.verify(bearerHeader, doc.result[userIndex].secret)
                
                if(typeof decoded.username === 'undefined' || decoded.username != req.body.username) {
                    out.error = `Authentication failed {${req.body.username}}`
                    return
                }

                let compare = await bcrypt.compareSync(req.body.password, doc.result[userIndex].password)

                if(compare) {
                    let removed = await removeAccount(doc.result[userIndex].user)
                    
                    if(removed.error) {
                        out.error = removed.error.substring(0, removed.error.indexOf(':'))
                        sendLog('mongodb', out.error, 2)
            
                        res.end(JSON.stringify(out))
                        return
                    }

                    out.result = 'Dccount removed'
                } else {
                    out.error = 'Invalid password'
                    return
                }
            } else {
                out.error = `Authentication failed {${req.body.username}}`
                return
            }
        })

        if(out.error) {
            sendLog('webserver', `(/removeaccount) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully removed account', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/clipboard', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/clipboard) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            date: null,
            error: null
        }

        await getUsers().then(doc => {
            if(doc.error) {
                sendLog('mongodb', doc.error, 2)

                out.error = doc.error.substring(0, doc.error.indexOf(':'))
                return
            }

            let userIndex
            for(let i=0; i<doc.result.length; i++) {
                if(doc.result[i].user === req.body.username) {
                    userIndex = i
                    break
                }
            }

            if(!userIndex && userIndex !== 0) {
                out.error = 'User not found'
                return
            }

            if(typeof doc.result[userIndex].secret === 'undefined') {
                out.error = 'Account secret not found, please contact with server adminstrator'
                return
            }

            let bearerHeader = req.headers.authorization
            if(typeof bearerHeader !== 'undefined') {
                const decoded = jwt.verify(bearerHeader, doc.result[userIndex].secret)
                
                if(typeof decoded.username === 'undefined' || decoded.username != req.body.username) {
                    out.error = `Authentication failed {${req.body.username}}`
                    return
                }

                let localDate = new Date(Date.parse(req.body.cbDate))
                let remoteDate = new Date(Date.parse(doc.result[userIndex].cbDate))
    
                if(localDate > remoteDate) {
                    setNewClipboard(req.body.cbText, req.body.cbDate, req.body.username)

                    out.result = req.body.cbText
                    out.date = req.body.cbDate
                } else {
                    out.result = doc.result[userIndex].cbText
                    out.date = doc.result[userIndex].cbDate
                }
            } else {
                out.error = `Authentication failed {${req.body.username}}`
                return
            }
        })

        if(out.error) {
            sendLog('webserver', `(/clipboard) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully sent clipboard data', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })

    app.post('/validateToken', async (req, res) => {
        sendLog('webserver', '', 3)
        sendLog('webserver', '-------------------- OPEN -------------------', 3)
        sendLog('webserver', `(/validateToken) Received request from {${req.ip}}`, 3)

        let out = {
            result: null,
            error: null
        }

        await getUsers().then(async doc => {
            if(doc.error) {
                sendLog('mongodb', doc.error, 2)

                out.error = doc.error.substring(0, doc.error.indexOf(':'))
                return
            }

            let userIndex
            for(let i=0; i<doc.result.length; i++) {
                if(doc.result[i].user === req.body.username) {
                    userIndex = i
                    break
                }
            }

            if(!userIndex && userIndex !== 0) {
                out.error = 'User not found'
                return
            }

            if(typeof doc.result[userIndex].secret === 'undefined') {
                out.error = 'Account secret not found, please contact with server adminstrator'
                return
            }

            let bearerHeader = req.headers.authorization
            if(typeof bearerHeader !== 'undefined') {
                const decoded = jwt.verify(bearerHeader, doc.result[userIndex].secret)
                
                if(typeof decoded.username === 'undefined' || decoded.username != req.body.username) {
                    out.error = `Authentication failed {${req.body.username}}`
                    return
                }

                out.result = 'Token is valid'
            } else {
                out.error = `Authentication failed {${req.body.username}}`
                return
            }
        })

        if(out.error) {
            sendLog('webserver', `(/validateToken) Request ended with an error: ( \x1b[31m${out.error}\x1b[0m )`, 2)

            if(out.error.includes('{')) {
                out.error = out.error.substring(0, out.error.indexOf('{') - 1)
            }
        } else {
            sendLog('webserver', 'Successfully changed password', 3)
        }

        res.end(JSON.stringify(out))

        sendLog('webserver', '-------------------- CLOSE ------------------', 3)
    })
}