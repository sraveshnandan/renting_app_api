const typeDefs = `#graphql



type Image{
    public_id:String,
    url:String
}
# user schema 
type User {
    _id:String,
    first_name:String,
    last_name:String,
    avatar:Image,
    email:String,
    email_verified:Boolean,
    role:String,
    phone_no:Int,
    email_verification:Config,
    recomendation:Recomendation
}
type Recomendation {
    city: String,
    flat: Boolean,
    Hostel: Boolean,
    PG: Boolean,
}

type Config {
    otpToken:String,
    expiry:Int
}


input RegisterInput {
    first_name:String,
    last_name:String,
    email:String,
    password:String
}

input LoginInput {
    
    email:String,
    password:String
}

type AuthResponse {
    user:User,
    token:String,
    message:String
}


# all queries 
type Query {
test:String
login(data:LoginInput):AuthResponse
verifyAcount(email:String,otp:String):String
resendEmail(email:String!):String
}



# all mutations 
type Mutation {
    register(data:RegisterInput):AuthResponse
}




`


export { typeDefs }