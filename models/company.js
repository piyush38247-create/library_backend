import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true
    },
    companyEmail : {
        type : String,
        required : true
    },
    companyContact : {
        type : Number,
        required : true
    },
    companyOwner : {
        type : String,
        required : true
    }
    

}, {timestamps : true})

export const company = mongoose.model("company", companySchema)