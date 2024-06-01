import jwt, { Secret } from 'jsonwebtoken';


interface ActivationToken {
    activation_code: string,
    token: string
}
export const createActivationToken = (user: any): ActivationToken => {
    const activation_code = Math.floor(1000 + Math.random() * 9000).toString()
    const token = jwt.sign({ user, activation_code }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: '5min' })
    return { activation_code, token }

}

