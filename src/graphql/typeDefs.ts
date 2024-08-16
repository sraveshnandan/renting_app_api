const typeDefs = `#graphql
# custom types 
scalar DateTime
scalar Upload
scalar Number

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
    phone_no:Number,
    email_verification:Config,
    recomendation:Recomendation,
    createdAt:DateTime,
    updatedAt:DateTime
}
type Recomendation {
    city: String,
    flat: Boolean,
    Hostel: Boolean,
    PG: Boolean,
}

type Config {
    otpToken:String,
    expiry:Number
}


input RegisterInput {
    first_name:String,
    last_name:String,
    email:String,
    password:String
}

input UserRecomendationInput{
    city: String,
    flat: Boolean,
    Hostel: Boolean,
    PG: Boolean,
}

input UpdateProfileInput {
    first_name:String
    last_name:String,
    avatar:Banner
    phone_no:Number
    recomendation:UserRecomendationInput
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


# notification schema 

type Notification {
    _id:String!
    unreaded:Boolean
    title:String!
    description:String!
    reciver:User
    createdAt:DateTime
    updatedAt:DateTime
}


# category schema 
type Category {
    _id:String!
    name:String!
    image:Image
    createor:User
    createdAt:DateTime
    updatedAt:DateTime
}


# category inputs 

input CreateCategoryInput {
    name:String!
    image:Banner
    createor:String!
}

# listing schema 

type Listing {
    _id:String
    name:String
    categories:[Category]
    banners:[Image]
    facilities:[String]
    opening_time:String
    closing_time:String
    owner:User
    address:String
    contact_no:String
    no_of_rooms:Number
    monthly_rent:Number
    electricity_cost:Number
    extra:Extra
    createdAt:DateTime,
    updatedAt:DateTime
}

type Extra {
    main_city:String
    details:String
    distance:Distance
    friends_allowed:Boolean
    for_all:Boolean
    for_family:Boolean
    for_girls:Boolean
    for_boys:Boolean
    free_electricty:Boolean
}

type Distance {
    railway_station:Number
    library:Number
    mall:Number
    medical_shop:Number
}





# listing inputs 

input Banner {
    public_id:String
    url:String
}

input DistanceInput {
    railway_station:Number
    library:Number
    mall:Number
    medical_shop:Number
}

input ExtraInput {
    main_city:String
    details:String
    distance:DistanceInput
    friends_allowed:Boolean
    for_all: Boolean,
    for_family: Boolean,
    for_girls: Boolean,
    for_boys: Boolean,
    free_electricty: Boolean
}
input CreateListingInput {
    name:String!
    banners:[Banner]
    categories:[String]
    facilities:[String]
    opening_time:String!
    closing_time:String!
    address:String!
    contact_no:String!
    no_of_rooms:Number!
    monthly_rent:Number!
    electricity_cost:Number!
    extra:ExtraInput

}


type UploadedFileResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }


# all queries 
    type Query {
        test:String
        # auth action queries 
        login(data:LoginInput):AuthResponse
        verifyAcount(email:String,otp:String):String
        resendEmail(email:String!):String
        fetchUserProfile:AuthResponse
        # notification action queries 
        getAllNotifications(limit:Number):[Notification]
        # category action queries 
        categories(limit:Number):[Category]
        # listing action queries 
        listings(limit:Number):[Listing]
    }



# all mutations 
type Mutation {
    # auth action mutations 
    register(data:RegisterInput):AuthResponse
    updateProfile(data:UpdateProfileInput):AuthResponse
    # category action mutations 
    createCategory(data:CreateCategoryInput):Category
    deleteCategory(ID:String!):String
    updateCAtegory(data:CreateCategoryInput):Category
    # listing action mutations 
    createListing(data:CreateListingInput):Listing
    deleteListing(ID:String!):String
    updateListing(data:CreateListingInput):Listing


    singleUpload(file: Upload!): String

}

`


export { typeDefs }