import dotenv from 'dotenv'
dotenv.config()

export const sendLog = (type, message, s) => {
    let date = `[ \x1b[35m${getLogDate()}\x1b[0m ]`
    let state = '[ \x1b[32mOK\x1b[0m ]'
    let component = ''

    switch(s) {
        case 1:
            state = '[ \x1b[33mWARNING\x1b[0m ]'
            break

        case 2:
            state = '[ \x1b[31mERROR\x1b[0m ]'
            break

        case 3:
            state = '[ \x1b[34mINFO\x1b[0m ]'
            break
    }

    switch(type) {
        case 'webserver':
            component = '[ \x1b[33mWEBSERVER\x1b[0m ]'
            break

        case 'mongodb':
            component = '[ \x1b[92mMongoDB\x1b[0m ]'
            break

        case 'bcrypt':
            component = '[ \x1b[95mBcrypt\x1b[0m ]'
            break
    }

    console.log(`${date} ${state} ${component} ${message}`)
}

const getLogDate = () => {
    let dateNow = new Date()
    return ((dateNow.getDate() < 10)?"0":"") + dateNow.getDate() +"."+(((dateNow.getMonth()+1) < 10)?"0":"") + (dateNow.getMonth()+1) +"."+ dateNow.getFullYear()+" | "+((dateNow.getHours() < 10)?"0":"") + dateNow.getHours() +":"+ ((dateNow.getMinutes() < 10)?"0":"") + dateNow.getMinutes() +":"+ ((dateNow.getSeconds() < 10)?"0":"") + dateNow.getSeconds();
}