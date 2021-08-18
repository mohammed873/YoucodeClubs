const Joi = require("joi");


//validating admin fields
const adminValidations = (data) => {
  const AdminValidation = Joi.object({
    full_name: Joi.string().min(4).required().messages({
      "string.base" : `full name should be a type of text`,
      "string.min": `full name should be at least 4 characters`,
      "string.empty": `full name cannot be an empty field`,
      "any.required": `full name is a required.`,
    }),
    email: Joi.string().email().required().messages({
      "string.base" : `email should be a type of text`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `invalid email adress`,
      "any.required": `email is a required.`,
    }),
    password: Joi.string().min(6).messages({
      "string.base" : `password should be a type of text`,
      "string.min": `password should be at least 6 characters`,
      "string.empty": `password cannot be an empty field`,
    }),
    club_id: Joi.string().required().messages({
      "string.base" : `club name should be a type of text`,
      "string.empty": `club name cannot be an empty field`,
      "any.required": `Select a club `,
    }),
    picture: Joi.string().required().messages({
      "string.base" : `picture should be a type of text`,
      "string.empty": `picture cannot be an empty field`,
      "any.required": `picture is a required.`,
    })
  });
  return AdminValidation.validate(data);
};




//validating the login
const LoginValidations = (data) => {
  const loginValidation = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base" : `email should be a type of text`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `invalid email adress`,
      "any.required": `email is a required.`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.base" : `password should be a type of text`,
      "string.min": `password should be at least 6 characters`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is a required.`,
    }),
  });
  return loginValidation.validate(data);
};



//validating super admin fields
const SuperAdminValidations = (data) => {
  const SuperAdminValidation = Joi.object({
    full_name: Joi.string().min(4).required().messages({
      "string.base" : `full name should be a type of text`,
      "string.min": `full name should be at least 4 characters`,
      "string.empty": `full name cannot be an empty field`,
      "any.required": `full name is a required.`,
    }),
    email: Joi.string().email().required().messages({
      "string.base" : `email should be a type of text`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `invalid email adress`,
      "any.required": `email is a required.`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.base" : `password should be a type of text`,
      "string.min": `password should be at least 6 characters`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is a required.`,
    }),
    picture: Joi.string().required().messages({
      "string.base" : `picture should be a type of text`,
      "string.empty": `picture cannot be an empty field`,
      "any.required": `picture is a required.`,
    })
  });
  return SuperAdminValidation.validate(data);
};

//validating super admin fields for updating
const SuperAdminValidationsForUpdate = (data) => {
  const SuperAdminValidation = Joi.object({
    full_name: Joi.string().min(4).required().messages({
      "string.base" : `full name should be a type of text`,
      "string.min": `full name should be at least 4 characters`,
      "string.empty": `full name cannot be an empty field`,
      "any.required": `full name is a required.`,
    }),
    email: Joi.string().email().required().messages({
      "string.base" : `email should be a type of text`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `invalid email adress`,
      "any.required": `email is a required.`,
    }),
    picture: Joi.string().required().messages({
      "string.base" : `picture should be a type of text`,
      "string.empty": `picture cannot be an empty field`,
      "any.required": `picture is a required.`,
    })
  });
  return SuperAdminValidation.validate(data);
};


// validating clubs fields
const ClubValidations = (data) => {
  const ClubValidation = Joi.object({
    name: Joi.string().min(4).max(50).required().messages({
      "string.base" : `club name should be a type of text`,
      "string.min": `club name  should be at least 4 characters`,
      "string.empty": `club name  cannot be an empty field`,
      "string.max": `club name  cannot be longer than 50 characters`,
      "any.required": `club name  is a required.`,
    }),
    description: Joi.string().min(20).max(200).required().messages({
      "string.base" : `description should be a type of text`,
      "string.min": `description  should be at least 20 characters`,
      "string.empty": `description  cannot be an empty field`,
      "string.max": `description  cannot be longer than 50 characters`,
      "any.required": `description  is a required.`,
    }),
    picture: Joi.string().required().messages({
      "string.base" : `picture should be a type of text`,
      "string.empty": `picture cannot be an empty field`,
      "any.required": `picture is a required.`,
    })
  });
  return ClubValidation.validate(data);
};


exports.adminValidations = adminValidations;
exports.LoginValidations = LoginValidations;
exports.SuperAdminValidations = SuperAdminValidations;
exports.SuperAdminValidationsForUpdate = SuperAdminValidationsForUpdate;
exports.ClubValidations = ClubValidations;