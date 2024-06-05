import { Button, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { wrongIcon } from '../../assets/icons';
import { useMutation } from 'react-query';
import {
  activateAccount,
  resetPasswordWithOtp,
  sendMailRecoverPassword,
} from '../../apis/auth';
import { useNavigate } from 'react-router-dom';
import { optModelOpen } from '../../@types/auth';

export const OtpModal = ({ type, open, close }: optModelOpen) => {
  const [optValue, setOtpValue] = useState('');
  const [email, setEmail] = useState('');
  const [reset, setReset] = useState(false);
  const [resetValue, setResetValue] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  //optverify;
  const { mutate: optVefiry, isSuccess: otpVerifySuccess } =
    useMutation(activateAccount);

  //recover password;
  const { mutate: passwordRecover, isSuccess: mailSendSuccess } = useMutation(
    sendMailRecoverPassword,
  );

  //send resetPassword with code;
  const { mutate: resetPassword } = useMutation(resetPasswordWithOtp);

  const handleComplete = async (value: string) => {
    const code = value;
    await optVefiry(code);
  };

  const handleChange = (value: any) => {
    setOtpValue(value);
  };
  const handleChangeResetOpt = (value: any) => {
    setResetValue(value);
  };

  const handleResetPassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPassword(e.target.value);
  };

  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };

  const sendPasswordRecoverEmail = async () => {
    await passwordRecover(email);
    sessionStorage.setItem('email', email);
  };

  const handleCompleteReset = async () => {
    const token = sessionStorage.getItem('reset-password') as string;
    const email = sessionStorage.getItem('email') as string;
    await resetPassword({
      token: token,
      activation_code: resetValue,
      password,
      email,
    });
    sessionStorage.clear();
    close();
  };
  useEffect(() => {
    if (otpVerifySuccess) {
      navigate('/');
    }
  }, [otpVerifySuccess]);

  useEffect(() => {
    if (mailSendSuccess) {
      setReset(true);
    }
  }, [mailSendSuccess]);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="otp-modal">
          <div style={{ textAlign: 'end' }}>
            <p onClick={close} style={{ cursor: 'pointer' }}>
              {wrongIcon}
            </p>
          </div>

          {type === 1 && (
            <div className="optInput">
              <h2> ACTIVATE ACCOUNT OTP</h2>
              <MuiOtpInput
                length={4}
                onComplete={handleComplete}
                onChange={handleChange}
                value={optValue}
                autoFocus
              />
            </div>
          )}
          {type === 2 && (
            <div className="optInput">
              {reset ? (
                <div className="optInput">
                  <h2>ENTER OTP</h2>
                  <MuiOtpInput
                    length={4}
                    onChange={handleChangeResetOpt}
                    value={resetValue}
                    autoFocus
                  />
                  <TextField
                    type="text"
                    size="small"
                    label="enter new password"
                    disabled={resetValue.length < 4}
                    fullWidth
                    value={password}
                    onChange={handleResetPassword}
                  />
                  <div style={{ width: '100%' }}>
                    <p
                      onClick={sendPasswordRecoverEmail}
                      className="textAlignEnd"
                    >
                      {' '}
                      Click resend
                    </p>
                  </div>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCompleteReset}
                  >
                    Reset password
                  </Button>
                </div>
              ) : (
                <>
                  <h1>Enter your email</h1>
                  <TextField
                    type="email"
                    size="small"
                    fullWidth
                    label="email"
                    value={email}
                    onChange={(e) => handleChangeEmail(e)}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={sendPasswordRecoverEmail}
                  >
                    Send
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
