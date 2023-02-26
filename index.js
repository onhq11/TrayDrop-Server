import { validateEnvironment } from './components/environment.js'
import { configWS } from './components/webserver/config.js'

if(validateEnvironment()) {
    await configWS()
}