import { validationResult } from "express-validator";
import { libraries } from "../../models/libraries.js"

export const registerLibrary = async(req, res, next)=>{
    try {

        const {libraryName, libraryEmail, libraryContact, address_line1,address_line2,city,state,pincode,subscription_plan,subscription_status} = req.body || {}

         const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return next({ status: 400, errors: errors.array() });
        }

        let librarydata = await libraries.findOne({libraryEmail})
      
        if(librarydata){
            return res.status(400).json({
                success : false,
                message : "library already registered !"
            })
        }

        librarydata = await libraries.create({
            libraryName, libraryEmail, libraryContact, address_line1,address_line2,city,state,pincode,subscription_plan,subscription_status
        })

         res.status(200).json({
                success : true,
                message : "library register successfully !",
                librarydata
            })
        
    } catch (err) {
        console.error(err)
        res.status(500).josn({
            success : false,
            message : err.message
        })
    }
}


export const updateLibrary = async(req, res, next)=>{
    try {

        const libraryId  = req.params.id

        const {libraryName, libraryEmail, libraryContact, address_line1,address_line2,city,state,pincode,subscription_plan,subscription_status} = req.body || {}

         const filter = {}

        if(libraryName) filter.libraryName = libraryName
        if(libraryEmail) filter.libraryEmail = libraryEmail
        if(libraryContact) filter.libraryContact = libraryContact
        if(address_line1) filter.address_line1 = address_line1
        if(address_line2) filter.address_line12= address_line2       
        if(city) filter.city = city
        if(state) filter.state = state
        if(pincode) filter.pincode = pincode
        if(subscription_plan) filter.subscription_plan = subscription_plan
        if(subscription_status) filter.subscription_status = subscription_status



        let librarydata = await libraries.findOneAndUpdate({_id : libraryId}, {
            $set : filter
        }, {new : true, runValidators : true})

        if(!librarydata){
            return res.status(404).json({
                success : false,
                message : "library not found !"
            })
        }

         res.status(200).json({
                success : true,
                message : "library updated sucessfully !",
                librarydata
            })
        
    } catch (err) {
        console.error(err)
        res.status(500).josn({
            success : false,
            message : err.message
        })
    }
}


export const getLibrares = async(req, res, next)=>{
    try {

        let librarydata = await libraries.find({})



         res.status(200).json({
                success : true,
                librarydata
            })
        
    } catch (err) {
        console.error(err)
        res.status(500).josn({
            success : false,
            message : err.message
        })
    }
}



export const deleteLibrary = async(req, res, next)=>{
    try {
        const libraryId = req.params.id
        let librarydata = await libraries.findOneAndDelete({_id : libraryId})

        if(!librarydata){
             return res.status(400).json({
                success : false,
                message : "library doesn't exits or already deleted !"
            })
        }

         res.status(200).json({
                success : true,
                message : "library deleted successfully !"
            })
        
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}



