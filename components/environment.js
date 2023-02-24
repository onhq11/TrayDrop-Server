import { sendLog } from "./logs.js"

export const validateEnvironment = () => {
    let envErrors = ''

    console.log('\n\x1b[32m>> TrayDrop <<\x1b[0m')
    console.log('\n---------- .ENV CONFIG ----------')
    console.log(`\x1b[33mWEBSERVER\x1b[0m`)

    console.log(`\x1b[32mOK\x1b[0m WEBSERVER_PORT: ${process.env.WEBSERVER_PORT}`)
    if(!process.env.WEBSERVER_PORT) envErrors+='WEBSERVER_PORT '

    console.log(`\n\x1b[31mDATABASE\x1b[0m`)
    console.log(`\x1b[32mOK\x1b[0m DATABASE_TYPE: ${process.env.DATABASE_TYPE}`)
    if(!process.env.DATABASE_TYPE) envErrors+='DATABASE_TYPE '

    console.log(`\x1b[32mOK\x1b[0m DATABASE_URL: ${process.env.DATABASE_URL}`)
    if(!process.env.DATABASE_URL) envErrors+='DATABASE_URL '

    // let mysqlHiddenPassword = '*'
    // for(let i = 4; i<process.env.MYSQL_PASSWORD.length; i++) {
    //     mysqlHiddenPassword += '*'
    // }

    // console.log(`\x1b[32mOK\x1b[0m MYSQL_PASSWORD: ${process.env.MYSQL_PASSWORD.substring(0, 3)}${mysqlHiddenPassword} (Length: ${process.env.MYSQL_PASSWORD.length})`)
    console.log('---------------------------------\n\n\n')

    if(envErrors !== '') {
        sendLog('webserver', `Invalid value (${envErrors.substring(0, envErrors.length-1)})`, 2)
        sendLog('webserver', `Check app docs for more info.`, 2)
		return false
	}
	
	return true
}
