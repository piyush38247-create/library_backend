import mongoose  from "mongoose";

const ReportSchema = new mongoose.Schema({
    reportTitle : {
        type : String,
        required : true
    },
    reportDescription : {
        type : String, 
        required : true
    }, 
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    },
    
 studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    libraryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "libraries"
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "company"
    },

    resolve : {
        type : Boolean,
        default : false
    },
    ReportRemark : {
        type : String
    }
}, {timestamps : true})


export const reports = mongoose.model("reports", ReportSchema)