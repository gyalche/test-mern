// Import commands.js using ES2015 syntax:
import './commands'

export const getToken = {
    method: 'POST',
    url: 'http://localhost:8000/auth',
    form: true,
    body: {
        //here you will send all needed information to access your API
        email: 'viktorialutskaya@freeprodesign.com',
        password: 'kanchaisdon'
    }
}

