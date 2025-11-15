import mongoose from "mongoose";
import { Payment } from "../../models/Payment.js";
import { ErrorHandler } from "../../utils/errorHandler.js"

export const getcompanyPayment = async(req, res, next)=>{
    try {

        const companyId = req.params.id

        if(!mongoose.Types.ObjectId.isValid(companyId)){
            return next(new ErrorHandler("company Id is not vaild", 400))
        }


        const paymentData = await Payment.find({companyId : companyId})

        if(!paymentData || paymentData.length == 0){
            return next(new ErrorHandler("no data found", 404))
        }

        res.status(200).json({
            success : true,
            Results : paymentData.length,
            paymentData
        })
        
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500))
    }
}


export const addcompanyPayment = async(req, res, next)=>{
    try {

        const {companyId, libraryId, amount, dueDate, paidDate, status, method, month,year} = req.body

        if(!companyId || !libraryId || !amount || !dueDate || !month || !year){
            return next(new ErrorHandler("enter all the required fields", 400))
        }

        const paymentData = await Payment.create({
            companyId : companyId,
            libraryId : libraryId,
            amount : amount,
            dueDate : dueDate,
            month : month,
            year : year
        })

        // if(!paymentData){
        //     return next(new ErrorHandler("", 404))
        // }

        await paymentData.save()

        res.status(200).json({
            success : true,
            paymentData
        })
        
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500))
    }
}


export const updatecompanyPayment = async(req, res, next)=>{
    try {

        const paymentId = req.params.id

        const {amount, dueDate, paidDate, status, method, month,year} = req.body

        const filter = {}

        if(amount) filter.amount = amount
        if(dueDate) filter.dueDate = dueDate
        if(paidDate) filter.paidDate = paidDate
        if(status) filter.status = status    
        if(method) filter.method = method
        if(month) filter.method = method
        if(year) filter.year = year
 
        if(!mongoose.Types.ObjectId.isValid(paymentId)){
            return next(new ErrorHandler("payment id is not vaild", 400))
        }


        const paymentData = await Payment.findOneAndUpdate({_id : paymentId},
            {
                $set : filter
            },
            {
                new : true, runValidators : true
            }
        )

        if(!paymentData){
            return next(new ErrorHandler("no data found", 404))
        }

        res.status(200).json({
            success : true,
            Results : paymentData.length,
            paymentData
        })
        
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500))
    }
}


export const deletecompanyPayment = async(req, res, next)=>{
    try {

        const paymentId = req.params.id

        if(!mongoose.Types.ObjectId.isValid(paymentId)){
            return next(new ErrorHandler("company Id is not vaild", 400))
        }


        const paymentData = await Payment.findOneAndDelete({_id : paymentId})

        if(!paymentData){
            return next(new ErrorHandler("no data found or already deleted !", 404))
        }

        res.status(200).json({
            success : true,
            message : "payment deleted success !"
        })
        
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500))
    }
}