const validator = require("validator");
const isEmpty = require("./is-empty");
const stringForValid = require("./string-for-valid");

module.exports = function validatePostInput(data) {
  let errors = {};

  let { text } = data;

  text = stringForValid(text);

  if (!validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (validator.isEmpty(text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
