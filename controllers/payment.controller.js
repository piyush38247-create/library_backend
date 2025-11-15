import {Payment}  from "../models/Payment.js";

 export const getPayments = async(req, res, next)=>{
    try {
        const payments = await Payment.find({}).populate("studentId", 'name email phone')
        if(!payments || payments.length === 0){
            return res.status(400).json({
                message : "payment not found !"
            })
        }

        res.status(200).json({
            success : true,
            results : payments.length,
            payments
        })
    } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
    }
}

export const getOneStudentPayment = async(req, res, next)=>{
    try {

        const studentId = req.params.id
        const payments = await Payment.find({studentId}).populate("studentId", 'name email phone')
       

        res.status(200).json({
            success : true,
            results : payments.length,
            payments
        })
    } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
    }
}

 export const addPendingPayment = async(req, res, next)=>{
    try {
        
        const {studentId, month, year, amount} = req.body

        if(!studentId || !month || !year || !amount){
            return res.status(400).json({
                success : false,
                message : "please fill all the required fields !"
            })
        }

        let paymentData = await Payment.findOne({studentId : studentId, month : month, year : year})

        if(paymentData){
            return res.status(400).json({
                success : false,
                message : `payment is alreay added for this  ${paymentData.month} month !`
            })
        }

        paymentData = await Payment.create({
            studentId,
            month,
            year, 
            amount
        })

        res.status(200).json({
            success : true,
            message : "payment added successfully !",
            paymentData
        })
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
}


export const depositPayment = async(req, res, next)=>{
    try {
        
        const {studentId, month, year, amount, paymentType} = req.body

        if(!studentId || !month || !year || !amount){
            return res.status(400).json({
                success : false,
                message : "please fill all the required fields !"
            })
        }

        let paymentData = await Payment.findOne({studentId : studentId, month : month, year : year})

        if(paymentData){
            paymentData.status = "paid"
            paymentData.paymentType = paymentType

            await paymentData.save()
            return res.status(200).json({
                success : true,
                message : "payment deposit successfully !",
                paymentData
        })
            
        }

        paymentData = await Payment.create({
            studentId,
            month,
            year, 
            amount,
            status : "paid",
            paymentType : paymentType

        })

        res.status(200).json({
            success : true,
            message : "payment deposit successfully !",
            paymentData
        })
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

}


export const updatePayment = async(req, res, next)=>{
    try {
       const paymentId = req.params.id
       const {amount, month , year, status} = req.body

       const filter = {}

       if(amount) filter.amount = amount
       if(month) filter.month = month
       if(year) filter.year = year
        if(status) filter.status = status

       const paymentData = await Payment.findOneAndUpdate({_id : paymentId},
        {
            $set : filter
        }, {new : true, runValidators : true}
       )

       if(!paymentData){
        return res.status(404).json({
            success : false,
            message : "payment data not found !",
        })
       }


        res.status(200).json({
            success : true,
            message : "payment updated suceessfully !",
            paymentData
        })
    } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
    }
}

 export const deletePayment = async(req, res, next)=>{
    try {

    const paymentId = req.params.id

    const paymentData = await Payment.findOneAndDelete({_id : paymentId})

    if(!paymentData){
        return res.status(404).json({
            success : false,
            message : "payment recod not found or already deleted!",
        })
    }

    res.status(200).json({
            success : true,
            message : "payment deleted !",
        })
        
    } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
    }
}



