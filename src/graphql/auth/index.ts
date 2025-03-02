import { GraphQLError } from "graphql";
import {
  handleEmailVerificationFunction,
  handleEmailVerificationResendOTPFunction,
  handleForgotPassword,
  handleLoginWithEmailFunction,
  handleOtpSendFunction,
  handlePasswordReset,
  handleRegistrationFunction,
  handleUserProfileFetchFunction,
  handleUserProfileUpdate,
} from "../../services/auth.services";
import { isLoggedIn } from "../../middlewares/Authorise";

const AuthResolvers = {
  Queries: {
    sendOtp: async (_, { phone_no }) => {
      const otpRes = await handleOtpSendFunction(phone_no);
      if (!otpRes.success) {
        return new GraphQLError(
          otpRes?.message ?? "Unable to process this request."
        );
      }
      delete otpRes.success;
      return otpRes.message;
    },
    verifyOtp: async (_, { phone_no, otp }) => {},
    loginWithEmail: async (_, { data }) => {
      const loginRes = await handleLoginWithEmailFunction(data);
      if (!loginRes.success) {
        return new GraphQLError(loginRes.message);
      }
      delete loginRes.success;
      return loginRes;
    },
    loginWithMobileOtp: async (_, { data }) => {},
    verifyEmail: async (_, { email, otp }) => {
      const verifyRes = await handleEmailVerificationFunction({ email, otp });
      if (!verifyRes.success) {
        return new GraphQLError(verifyRes.message);
      }
      delete verifyRes.success;
      return verifyRes.message;
    },
    resendEmail: async (_, { email }) => {
      const emailResendRes = await handleEmailVerificationResendOTPFunction({
        email,
      });
      if (!emailResendRes.success) {
        return new GraphQLError(emailResendRes.message);
      }
      delete emailResendRes.success;
      return emailResendRes.message;
    },
    fetchUserProfile: async (_, {}, context) => {
      if (!context.token) {
        return new GraphQLError("Please provide authentication token.");
      }
      const fetchProfileRes = await handleUserProfileFetchFunction(
        context.token
      );
      if (!fetchProfileRes.success) {
        return new GraphQLError(fetchProfileRes.message);
      }
      return fetchProfileRes;
    },
    forgotPassword: async (_, { email }) => {
      const res = await handleForgotPassword(email);
      if (!res.success) {
        return new GraphQLError(res.message);
      }
      return res.message;
    },
    resetPassword: async (_, { data }) => {
      const res = await handlePasswordReset(data);
      if (!res.success) {
        return new GraphQLError(res.message);
      }
      return res.message;
    },
  },
  Mutations: {
    register: async (_, { data }, context) => {
      const registerRes = await handleRegistrationFunction(data);
      if (!registerRes.success) {
        return new GraphQLError(registerRes.message);
      }
      delete registerRes.success;
      return registerRes;
    },
    updateProfile: async (_, { data }, context) => {
      const user: any = await isLoggedIn(context.token);
      if (!user) {
        return new GraphQLError(
          "Unauthenticated, please login to perform this action."
        );
      }
      const updateProfileRes = await handleUserProfileUpdate({
        id: user._id,
        userAvatar: user.avatar,
        ...data,
      });
      if (!updateProfileRes.success) {
        return new GraphQLError(updateProfileRes.message);
      }
      delete updateProfileRes.success;
      return updateProfileRes;
    },
  },
};

export { AuthResolvers };
