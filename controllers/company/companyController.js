import { Result, validationResult } from "express-validator"
import { company } from "../../models/company.js"
import { ErrorHandler } from "../../utils/errorHandler.js"


export const createCompany = async(req, res, next)=>{
    try {
        
        const { companyName, companyEmail, companyContact, companyOwner} = req.body || {}

        let companyData = await company.find({})

        if(companyData.length > 0){
            return next(new ErrorHandler("company already registered !", 400))
        }

        const error = validationResult(req)

        if(!error.isEmpty()){
            return next(new ErrorHandler(error.array(), 400))
        }

        companyData = await company.create({
            companyName, 
            companyEmail,
            companyContact, 
            companyOwner
        })

        res.status(200).json({
            success : true,
            message : "company created successfully !",
            companyData
        })
        
    } catch (err) {
        console.error(err)
        next(new ErrorHandler("something went wrong", 500))
    }   
}



export const updateCompany = async(req, res, next)=>{
    try {
        const companyId = req.params.id
        const { companyName, companyEmail, companyContact, companyOwner} = req.body || {}

       const filter = {}

       if(companyName) filter.companyName = companyName
       if(companyEmail) filter.companyEmail = companyEmail
       if(companyContact) filter.companyContact = companyContact
       if(companyOwner) filter.companyOwner = companyOwner
  
       const companyData = await company.findOneAndUpdate({_id : companyId}, 
        {
            $set : filter
        }, 
        {new : true, runValidators : true}
       )

        

        res.status(200).json({
            success : true,
            message : "company updated successfully !",
            companyData
        })
        
    } catch (err) {
        console.error(err)
        next(new ErrorHandler("something went wrong", 500))
    }   
}




export const getCompany = async(req, res, next)=>{
    try {
        
        const companyData = await company.find({})

        if(!companyData || companyData.length === 0){
            return next(new ErrorHandler("company not found", 404))
        }

       
        res.status(200).json({
            success : true,
            Result : companyData.length,
            companyData
        })
        
    } catch (err) {
        console.error(err)
        next(new ErrorHandler("something went wrong", 500))
    }   
}



export const deleteCompany = async(req, res, next)=>{
    try {
        
        const companyId = req.params.id

        const companyData = await company.findOneAndDelete({_id : companyId})

        if(!companyData){
            return next(new ErrorHandler("company not found or already deleted !", 404))
        }
        res.status(200).json({
            success : true,
            message : "company deleted !"
        })
        
    } catch (err) {
        console.error(err)
        next(new ErrorHandler("something went wrong", 500))
    }   
}