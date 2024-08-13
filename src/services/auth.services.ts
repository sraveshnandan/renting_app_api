import { compareSync, hashSync } from "bcrypt";
import { User } from "../database/models/user.model";
import { GenerateOtp, SendVerificationEmail } from "../utils";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
import { sendEmail } from "../lib";
import { SendEmailBYSMTP } from "../lib/mailersend";


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
        await SendEmailBYSMTP(email, "OTP verification Code", otp)

        const newUserPayload = {
            ...data, password: hashedPassword, email_verification: {
                otp,

                expiry: new Date(Date.now() + 10 * 60 * 1000) //10 minutes
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



export { handleRegistrationFunction, handleLoginFunction, handleEmailVerificationFunction, handleEmailVerificationResendOTPFunction }