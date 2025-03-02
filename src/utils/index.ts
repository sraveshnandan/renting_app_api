import os from "os";
import { SMS_GATEWAY_SECRET, SMS_GATEWAY_URL, StatusSecret } from "../config";
import { GraphQLError } from "graphql";

type NextFunction = () => void;
// Function to authenticate Server Crediential
const Authenticate = async (secretKey: string, next: NextFunction) => {
  if (secretKey === "hi") {
    return next();
  }
  return new GraphQLError("Invalid Api key.");
};

// Function to Get system information
const StatusInfo = (secret: string) => {
  const data = {
    os: os.hostname(),
    arch: os.arch(),
    platform: os.platform(),
    release: os.release(),
    machine: os.machine(),
    memory: os.totalmem(),
    uptime: os.uptime(),
    user: os.userInfo(),
    network: os.networkInterfaces().lo[0],
  };
  if (secret !== StatusSecret) {
    return null;
  }
  return data;
};

// Function to Generate OTP

const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  return otp.toString();
};

const SendVerificationEmail = async (email: string, code: string) => {
  try {
  } catch (error) {}
};

const sendOtpOnPhoneNumber = async (phone_no: number, otp: number) => {
  const smsBody = {
    route: "otp",
    variables_values: otp,
    numbers: phone_no,
    flash: "1",
  };
  try {
    const resp = await fetch(SMS_GATEWAY_URL!, {
      headers: {
        "Content-Type": "application/json",
        authorization: `${SMS_GATEWAY_SECRET! ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(smsBody),
    });
    const data: Record<string, any> = await resp.json();
    console.log("otp res", data);
    return data?.return;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  Authenticate,
  StatusInfo,
  GenerateOtp,
  SendVerificationEmail,
  sendOtpOnPhoneNumber,
};
