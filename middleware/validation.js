import { body ,validationResult} from 'express-validator';
// Validation auth rules
export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'admin', 'super_admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];


//  admin  validation 

export const createAdminValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'super_admin']).withMessage('Invalid role')
];


//  alert validtion


export const createAlertValidation = [
  body("type")
    .notEmpty().withMessage("Alert type is required")
    .isIn(["info", "warning", "error", "success"])
    .withMessage("Type must be one of: info, warning, error, success"),
  body("title")
    .notEmpty().withMessage("Alert title is required"),
  body("message")
    .notEmpty().withMessage("Alert message is required"),
];

export const validateAlert = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};



// expense validtions


export const expenseValidation = [
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['utilities', 'maintenance', 'supplies', 'staff', 'marketing', 'other'])
    .withMessage('Category must be one of: utilities, maintenance, supplies, staff, marketing, other'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .withMessage('Description must be required'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a valid number')
    .custom(value => value > 0).withMessage('Amount must be greater than 0'),

];
export const validateExpense = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};


// payments validations 

export const paymentValidation = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
    .isMongoId().withMessage('Invalid student ID format'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a valid number')
    .custom(value => value > 0).withMessage('Amount must be greater than 0'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD)'),

  body('month')
    .notEmpty().withMessage('Month is required')
    .isString().withMessage('Month must be a string'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),

];


//  seat validations 

export const seatValidation = [
  body('seatNumber')
    .notEmpty().withMessage('Seat number is required')
    .isInt({ min: 1 }).withMessage('Seat number must be a positive integer'),
];


// students  validtions 
 export const studentValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('shift').isIn(['morning', 'afternoon', 'evening', 'night']).withMessage('Invalid shift'),
  body('seatPreference').optional().isIn(['any', 'window', 'quiet', 'group'])
];

export const libraryValidation = [
  body('libraryName').trim().isLength({min : 1}).withMessage("Name is required"),
  body('libraryEmail').isEmail().withMessage("provide a valid email"),
  body('libraryContact').isMobilePhone().withMessage("please provide a valid phone number"),
  body('address_line1').trim().isLength({min : 5}).withMessage("address must be atleast 5 character"),
  body('city').trim().isLength({min : 1}).withMessage("please provide a city name"),
  body('state').trim().isLength({min : 1}).withMessage("please provide a state Name"),
  body('pincode').notEmpty().withMessage("pincode is required !")
  .isInt({min : 1}).withMessage('pincode should be in positive number')
]

export const companyCreateValidation = [
  body('companyName').trim().notEmpty().withMessage("companyName is required !"),
  body('companyEmail').trim().isEmail().withMessage("companyEmail is required !"),
  body('companyContact').trim().isNumeric().withMessage("companyContact is required !"),
  body('companyOwner').trim().isLength({min : 1}).withMessage("companyOwner name  is required !"),
]



