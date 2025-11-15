import mongooes from 'mongoose'

const librarySchema = new mongooes.Schema({
    libraryName : {
        type : String,
        required : true
    },

    libraryEmail : {
        type : String,
        required : true
    }, 

    libraryContact : {
        type : String,
        required : true
    }, 

    address_line1 : {
        type : String,
        required : true
    }, 

    address_line2 : {
        type : String
    }, 

    city : {
        type : String,
        required : true
    }, 

    state : {
        type : String,
        required : true
    }, 

    pincode : {
        type : Number,
        required : true
    }, 

    subscription_plan : {
        type : String,
        enum : ['free_membership', 'premium_membership', 'diamond_membership'],
        default : 'free_membership'
    },
    subscription_status : {
        type : String,
        enum : ['active', "inactive", "suspended"]
    },
    isActive : {
        type : Boolean, 
        default : false
    }

}, {timestamps : true})



export  const libraries = mongooes.model('libraries',librarySchema)