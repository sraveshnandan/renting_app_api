import { GraphQLError } from "graphql";
import { handleEmailVerificationFunction, handleEmailVerificationResendOTPFunction, handleLoginFunction, handleRegistrationFunction } from "../services/auth.services";

const resolvers = {
  Query: {

    test: () => {
      return "working..."
    },
    login: async (_, { data }) => {
      const loginRes = await handleLoginFunction(data);
      if (!loginRes.success) {
        return new GraphQLError(loginRes.message)

      }
      delete loginRes.success;
      return loginRes

    },
    verifyAcount: async (_, { email, otp }) => {
      const verifyRes = await handleEmailVerificationFunction({ email, otp });
      if (!verifyRes.success) {
        return new GraphQLError(verifyRes.message)

      }
      delete verifyRes.success;
      return verifyRes.message
    },
    resendEmail: async (_, { email }) => {
      const emailResendRes = await handleEmailVerificationResendOTPFunction({ email });
      if (!emailResendRes.success) {
        return new GraphQLError(emailResendRes.message)

      }
      delete emailResendRes.success;
      return emailResendRes.message
    }

  },
  Mutation: {
    register: async (_, { data }, context) => {
      const registerRes = await handleRegistrationFunction(data);
      if (!registerRes.success) {
        return new GraphQLError(registerRes.message)
      }
      delete registerRes.success
      return registerRes

    }

  }
}


export { resolvers }