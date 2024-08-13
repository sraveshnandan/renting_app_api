import os from "os";
import { StatusSecret } from "../config";
import { GraphQLError } from "graphql";
import { sendEmail } from "../lib";

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
    

  } catch (error) {

  }
}

export { Authenticate, StatusInfo, GenerateOtp, SendVerificationEmail };
