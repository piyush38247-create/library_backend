import { Router } from "express";
import { createCompany, deleteCompany, getCompany, updateCompany } from "../../controllers/company/companyController.js";
import { companyCreateValidation } from "../../middleware/validation.js";
import { createCompanyExpenses, deleteCompanyExpenses, getCompanyExpenses, updateCompanyExpenses } from "../../controllers/company/expenceController.js";
import {createCompanyReport, getCompanyReports, getCompanyReportById, updateCompanyReport, deleteCompanyReport,
} from "../../controllers/company/reportController.js";
import {createCompanySupport,getCompanySupports,updateCompanySupportStatus,deleteCompanySupport,createCompanyMessage,getCompanyMessages,updateCompanyMessage,deleteCompanyMessage,
} from "../../controllers/company/supportController.js";
import { authenticate } from "../../middleware/auth.js";
import { companyDeleteAlert, companyMarkAllAsRead, companyMarkAsRead, createCompanyAlert, getCompanyAllAlert } from "../../controllers/company/alertController.js"
import { addcompanyPayment, deletecompanyPayment, getcompanyPayment, updatecompanyPayment } from "../../controllers/company/paymentController.js";
const router = Router()

//company details

router.get("/", getCompany)
router.post("/",companyCreateValidation ,createCompany)
router.put("/:id", updateCompany)
router.delete("/:id", deleteCompany)



// alert route company 

router.get("/alert/:id", getCompanyAllAlert)
router.post("/alert", createCompanyAlert)
router.put("/alert/:id", companyMarkAllAsRead)
router.patch("/alert/:id", companyMarkAsRead)
router.delete("/alert/:id", companyDeleteAlert)

 


// expense company 

router.get("/expense/:id", getCompanyExpenses)
router.post("/expense", createCompanyExpenses)
router.put("/expense/:id", updateCompanyExpenses)
router.delete("/expense/:id", deleteCompanyExpenses)


//  company  report routes

router.post("/reports", authenticate, createCompanyReport);
router.get("/stats/:companyId", authenticate, getCompanyReports);
router.get("/:id", authenticate, getCompanyReportById);
router.put("/:id/report", authenticate, updateCompanyReport);
router.delete("/:id/report", authenticate, deleteCompanyReport);

// company  support routes

router.post("/:companyId/supports", authenticate, createCompanySupport);
router.get("/:companyId/supports", authenticate, getCompanySupports);
router.put("/supports/:id/status", authenticate, updateCompanySupportStatus);
router.delete("/supports/:id", authenticate, deleteCompanySupport);


// company  meassage routes

router.post("/supports/:supportId/messages", authenticate, createCompanyMessage);
router.get("/supports/:supportId/messages", authenticate, getCompanyMessages);
router.put("/messages/:messageId", authenticate, updateCompanyMessage);
router.delete("/messages/:messageId", authenticate, deleteCompanyMessage);


// payment route company 

router.get("/payment/:id", getcompanyPayment)
router.post("/payment", addcompanyPayment)
router.put("/payment/:id", updatecompanyPayment)
router.delete("/payment/:id", deletecompanyPayment)


export {router as companyRouter} 
