import { compareSync, hashSync } from "bcrypt";
import { User } from "../database/models/user.model";
import { GenerateOtp } from "../utils";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { SendEmailBYSMTP } from "../lib/mailersend";
import { isLoggedIn } from "../middlewares/Authorise";
import { cloudinary } from "../lib/cloudinary";
import { sendEmail } from "../lib";
import { Notification } from "../database/models/notification.model";


// registration function 
const handleRegistrationFunction = async (data: any) => {
    try {
        const { first_name, last_name, email, password } = data;
        // checking if user already exists with this email 
        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) {
            return {
                success: false,
                message: "Email already exists."
            }
        }

        // hashing the password 
        const hashedPassword = hashSync(password, 10);


        // sending verification email 
        const otp = GenerateOtp()
        // await SendEmailBYSMTP(email, "OTP verification Code", otp)
        await sendEmail(email, "OTP Verification Code", otp)

        let newUserPayload = {
            ...data, password: hashedPassword, email_verification: {
                otp,

                expiry: new Date(Date.now() + 10 * 60 * 1000) //10 minutes
            }
        };
        if (!data.avatar) {
            newUserPayload.avatar = {
                public_id: "demo",
                url: "https://avatar.iran.liara.run/public"
            }
        }

        // creating new user 
        const user = await User.create(newUserPayload);

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "30d"
        })

        // returning final response 
        return {
            success: true,
            token, user, message: "Account created successfully."
        }

    } catch (error) {
        console.log("error occured in handleRegistration fn ", error);
        return {
            success: false,
            message: `${error.message}`
        }
    }

}


// login function 
const handleLoginFunction = async (data: any) => {
    try {

        const { email, password } = data;

        //    checking if user exists with same email 
        const user = await User.findOne({ email }).select("+password");

        // if no user exists 
        if (!user) {
            return {
                success: false,
                message: "Invalid Credientials."
            }
        }

        // comparing password 
        const isPassOk = compareSync(password, user.password);

        if (!isPassOk) {
            return {
                success: false,
                message: "Invalid Credientials."
            }
        }


        const isEmailVerified = user.email_verified;
        if (!isEmailVerified) {
            return {
                success: false,
                message: "Your account is not verified yet, please verify your account."
            }

        }


        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "30d"
        })



        // returning final response 
        return {
            success: true,
            token, user, message: "Logged in successfully."
        }

    } catch (error) {
        console.log("error occured in handleRegistration fn ", error.message);
        return {
            success: false,
            message: `${error.message}`
        }
    }

}

// account verify function 
const handleEmailVerificationFunction = async (data: any) => {
    try {

        const { email, otp } = data;

        //    checking if user exists with same email 
        let user = await User.findOne({ email }).select("+password");

        // if no user exists 
        if (!user) {
            return {
                success: false,
                message: "No Account found."
            }
        }

        if (user.email_verified) {
            return {
                success: true,
                message: "Your account is already verified."
            }
        }


        // checking otp expiry 


        const isOTPExpire = user.email_verification.expiry < new Date();

        if (isOTPExpire) {
            return {
                success: false,
                message: "OTP expired, please retry your  email verification."
            }
        }



        // comparing otp 
        const isOTPOk = otp.toString() === user.email_verification.otp.toString()

        if (!isOTPOk) {
            return {
                success: false,
                message: "Invalid or Expired OTP."
            }
        }


        // saving verified state 
        user.email_verified = true;
        await user.save()



        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your account verified successfully.",
            description: `Dear ${user.first_name}, we are glad to inform you that your account is successfully verified. Now you can access our application without any restrictions. Thank you.`,
            reciver: user._id
        }
        await Notification.create(newNotificationPayload);

        // returning final response 
        return {
            success: true,
            message: "Email verified successfully."
        }

    } catch (error) {
        console.log("error occured in handleemailverification fn ", error.message);
        return {
            success: false,
            message: `${error.message}`
        }
    }

}

// verification email resend function 
const handleEmailVerificationResendOTPFunction = async (data: any) => {
    try {

        const { email } = data;

        //    checking if user exists with same email 
        let user = await User.findOne({ email }).select("+password");

        // if no user exists 
        if (!user) {
            return {
                success: false,
                message: "No Account found."
            }
        }

        if (user.email_verified) {
            return {
                success: false,
                message: "Your account is already verified, no need to resend otp email."
            }

        }

        const otp = GenerateOtp();

        await SendEmailBYSMTP(email, "OTP verification code", otp);



        user.email_verification = {
            otp,
            expiry: new Date(Date.now() + 10 * 60 * 1000)
        }
        await user.save()


        return {
            success: true,
            message: `OTP sent successfully on ${email}`

        }

    } catch (error) {
        console.log("error occured in email resend  fn ", error.message);
        return {
            success: false,
            message: `${error.message}`
        }
    }

}


// fetching user profile function 
const handleUserProfileFetchFunction = async (data: string) => {
    try {
        const user: any = await isLoggedIn(data);
        if (!user) {
            return {
                success: false,
                message: "Invalid token provided, please login again."
            }
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "30d"
        })
        return {
            success: true,
            message: "User profile refreshed successfully.",
            user,
            token

        }
    } catch (error) {
        console.log("error occured while fetching user profile.", error);
        return {
            success: false,
            message: error.message
        }

    }
}





// updating  user profile 

const handleUserProfileUpdate = async (data: any) => {
    try {

        const dataToUpdate = { ...data }
        // deleting previous user avatar 
        if (data.avatar && data.userAvatar.public_id !== "demo") {
            const res = await cloudinary.uploader.destroy(data.userAvatar.public_id);
            console.log("previous avatar deleted from storage.", res)
        }
        const updatedUser = await User.findByIdAndUpdate({ _id: data.id }, { ...dataToUpdate }, { new: true })
        const token = jwt.sign({ id: updatedUser._id }, JWT_SECRET, { expiresIn: "30d" })

        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your profile updated.",
            description: "The changes you have requested to update in your Profile is completed now. Thank you. ",
            reciver: updatedUser._id
        }
        await Notification.create(newNotificationPayload);
        return {
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
            token
        }


    } catch (error) {
        return {
            success: false,
            message: error.message
        }

    }
}


// for handling forgot password  


const handleForgotPassword = async (email: string) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return {
                success: false,
                message: "No account found."
            }
        }
        const OTP = GenerateOtp();


        user.password_reset_config = {
            token: OTP,
            expiry: new Date(Date.now() + 10 * 60 * 1000)
        }

        await user.save();
        await sendEmail(user.email, "Password reset OTP", OTP)
        return {
            success: true,
            message: `Password reset otp sent to ${user.email}`
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}
// for handling reset  password  


const handlePasswordReset = async (data: { otp: string, email: string, newPassword: string }) => {
    try {
        const { email, otp, newPassword } = data;
        let user = await User.findOne({ email });
        if (!user) {
            return {
                success: false,
                message: "No account found."
            }
        }

        const isOTPMatched = user.password_reset_config.token.toString() === otp.toString();
        if (!isOTPMatched) {
            return {
                success: false,
                message: "Invalid OTP."
            }
        }

        // hashing the password 
        const newhashedPassword = hashSync(newPassword, 10);

        user.password = newhashedPassword;

        await user.save();

        // creatinh new notification 
        const newNotificationPayload = {
            title: "Your password has been updated successfully.",
            description: "Your account password is updated now, you can use your new password  to login in our app. Thank you",
            reciver: user._id
        }
        await Notification.create(newNotificationPayload);

        return {
            success: true,
            message: "Password reset successfully."
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}





export {
    handleRegistrationFunction,
    handleLoginFunction,
    handleEmailVerificationFunction,
    handleEmailVerificationResendOTPFunction,
    handleUserProfileFetchFunction,
    handleUserProfileUpdate,
    handlePasswordReset,
    handleForgotPassword
}