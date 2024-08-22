import { Notification } from "../database/models/notification.model"

const handleGetUserNotifications = async (data: any) => {
    try {
        const { limit, userId } = data;
        const allUserNotifications = await Notification.find({ reciver: userId }).sort({ createdAt: -1 }).limit(limit)
        if (!allUserNotifications.length) {
            return {
                success: false,
                message: "No notifications yet."
            }
        }

        return {
            success: true,
            notifications: allUserNotifications
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}


const handleMarkNotificationRead = async (notificationId: string) => {
    try {

        const updatedNotification = await Notification.findByIdAndUpdate({ _id: notificationId }, { unreaded: false }, { new: true });

        if (!updatedNotification) {
            return {
                success: false,
                message: "Invalid Notification ID, no notification found."
            }
        }

        return {
            success: true,
            notification: updatedNotification
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export {
    handleGetUserNotifications,
    handleMarkNotificationRead
}