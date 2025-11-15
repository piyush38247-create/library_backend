    import  libraries from "../models/libraries.js"

    export const registerLibrary = async(req, res, next)=>{
        try {

            const {libraryName, libraryEmail, libraryContact, libraryAddress} = req.body || {}

            if(!libraryName || !libraryEmail || !libraryContact || !libraryAddress ){
                return res.status(400).json({
                    success : false,
                    message : "please fill the fields !"
                })
            }

            let librarydata = await libraries.findOne({libraryEmail})

            if(librarydata){
                return res.status(400).json({
                    success : false,
                    message : "library already registered !"
                })
            }

            librarydata = await libraries.create({
                libraryName, 
                libraryEmail, 
                libraryContact,
                libraryAddress
            })

            res.status(200).josn({
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


