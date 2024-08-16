import { GraphQLError } from "graphql";
import {
    handleEmailVerificationFunction,
    handleEmailVerificationResendOTPFunction,
    handleLoginFunction,
    handleRegistrationFunction,
    handleUserProfileFetchFunction,
    handleUserProfileUpdate
} from "../../services/auth.services";
import { isLoggedIn } from "../../middlewares/Authorise";

const AuthResolvers = {
    Queries: {
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
        },
        fetchUserProfile: async (_, { }, context) => {
            if (!context.token) {
                return new GraphQLError("Please provide authentication token.")
            }
            const fetchProfileRes = await handleUserProfileFetchFunction(context.token);
            if (!fetchProfileRes.success) {
                return new GraphQLError(fetchProfileRes.message)
            }
            return fetchProfileRes
        }
    },
    Mutations: {
        register: async (_, { data }, context) => {
            const registerRes = await handleRegistrationFunction(data);
            if (!registerRes.success) {
                return new GraphQLError(registerRes.message)
            }
            delete registerRes.success
            return registerRes

        },
        updateProfile: async (_, { data }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user) {
                return new GraphQLError("Unauthenticated, please login to perform this action.")
            }
            const updateProfileRes = await handleUserProfileUpdate({ id: user._id, userAvatar: user.avatar, ...data });
            if (!updateProfileRes.success) {
                return new GraphQLError(updateProfileRes.message)
            }
            delete updateProfileRes.success
            return updateProfileRes;
        }
    }
}

export { AuthResolvers }