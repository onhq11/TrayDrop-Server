import { validateEnvironment } from './components/environment.js'
import { configMDB } from './components/databases/mongodb/config.js'
import { configWS } from './components/webserver/config.js'

if(validateEnvironment()) {
    configWS()

    switch(process.env.DATABASE_TYPE) {
        case 'mongodb':
            configMDB()
            break
    }
}