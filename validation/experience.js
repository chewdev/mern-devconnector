const validator = require("validator");
const isEmpty = require("./is-empty");
const stringForValid = require("./string-for-valid");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  let { title, company, from } = data;

  title = stringForValid(title);
  company = stringForValid(company);
  from = stringForValid(from);

  if (validator.isEmpty(title)) {
    errors.title = "Job title field is required";
  }

  if (validator.isEmpty(company)) {
    errors.company = "Company field is required";
  }

  if (validator.isEmpty(from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
