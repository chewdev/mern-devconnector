const validator = require("validator");
const isEmpty = require("./is-empty");
const stringForValid = require("./string-for-valid");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  let { school, degree, fieldofstudy, from } = data;

  school = stringForValid(school);
  degree = stringForValid(degree);
  from = stringForValid(from);
  fieldofstudy = stringForValid(fieldofstudy);

  if (validator.isEmpty(school)) {
    errors.school = "School field is required";
  }

  if (validator.isEmpty(degree)) {
    errors.degree = "Degree field is required";
  }

  if (validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  if (validator.isEmpty(from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
