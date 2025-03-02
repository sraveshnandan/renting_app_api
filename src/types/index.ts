// this file is only used to declare types

export type RegistrationPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_no: number;
};

export type LoginWithPhonePayload = {
  phone_no: number;
  otp: number;
};

export type PhoneVerificationPayload = {
  phone_no: number;
  otp: number;
};
