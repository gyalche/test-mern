// Import commands.js using ES2015 syntax:
import './commands'

export const getToken = {
    method: 'POST',
    url: 'auth/login',
    form: true,
    body: {
        email: 'dawa.sherpa@esignature.com.np',
        password: 'dawasherpa'
    }
}

