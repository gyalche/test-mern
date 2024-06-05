export type loginType = {
  email: string;
  password: string;
};

export type resetPasswordType = {
    token: string;
    activation_code: string;
    password: string;
    email: string;
}