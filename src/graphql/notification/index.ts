import { GraphQLError } from "graphql";
import { isLoggedIn } from "../../middlewares/Authorise"
import { handleGetUserNotifications, handleMarkNotificationRead } from "../../services/notification.services"

const NotificationResolvers = {
    Queries: {
        getAllNotifications: async (_, { limit }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorise, please login to create this listing.")

            }
            const notiRes = await handleGetUserNotifications({ limit, userId: user._id });
            if (!notiRes.success) {
                return new GraphQLError(notiRes.message)
            }
            return notiRes.notifications
        }
    },
    Mutations: {
        updateNotification: async (_, { ID }, context) => {
            const user: any = await isLoggedIn(context.token);
            if (!user.first_name) {
                return new GraphQLError("Unauthorise, please login to create this listing.")

            }

            const notRes = await handleMarkNotificationRead(ID);
            if (!notRes.success) {
                return new GraphQLError(notRes.message)
            }

            return notRes.notification
        }
    }
}

export { NotificationResolvers }