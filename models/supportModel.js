import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "company"
    },
    libraryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "libraries"
    },
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student"
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

    status : {
        type : String,
        enum : ['open', 'closed'],
        default : 'open'
    },

},{timestamps : true})

export const support = mongoose.model('support', supportSchema)