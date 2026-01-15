import {body} from 'express-validator';

const userRegistrationValidator = () => {
    return[
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({min: 3}).withMessage("Username must be at least 3 characters long")
            .isLength({max: 20}).withMessage("Username must be at most 20 characters long"),
        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
        body("role")
            .notEmpty().withMessage("Role is required")
            .isIn(["admin", "project_admin", "member"]).withMessage("Role is invalid"),
    ];
};

const userLoginValidator = () => {
    return[
        body("email")
            .trim
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("password")
            .notEmpty().withMessage("Password is required"),
    ];
};
export {userRegistrationValidator, userLoginValidator};