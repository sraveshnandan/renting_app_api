import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { User } from "../database/models/user.model";
import { GraphQLError } from "graphql";

const IsAuthenticated = async (req, res, next, token) => {
    try {

    } catch (error) {


    }
}

const isLoggedIn = async (token: string) => {
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const currentTime = Math.floor(Date.now() / 1000);
        if (!decoded) {
            return new GraphQLError("invalid token, please provide correct one.")

        }
        if (decoded.exp < currentTime) {

            return new GraphQLError("Token invalid or expired, please login again.")

        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return new GraphQLError("token malformed oer expired, please login again.")
        }
        return user

    } catch (error) {
        console.log("err while vrifying jwt token.", error.message)
        return new GraphQLError(error.message)

    }
}





export { IsAuthenticated, isLoggedIn }