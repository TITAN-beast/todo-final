const {
  validateRegistration,
  validateLogin,
  validateCreateTodo,
  validateUpdateTodo,
} = require('../utils/validation');
const { sendError } = require('../utils/response');

function validateRegisterInput(req, res, next) {
  const result = validateRegistration(req.body);
  if (!result.isValid) {
    return sendError(res, 400, result.message);
  }
  next();
}

function validateLoginInput(req, res, next) {
  const result = validateLogin(req.body);
  if (!result.isValid) {
    return sendError(res, 400, result.message);
  }
  next();
}

function validateCreateTodoInput(req, res, next) {
  const result = validateCreateTodo(req.body);
  if (!result.isValid) {
    return sendError(res, 400, result.message);
  }
  next();
}

function validateUpdateTodoInput(req, res, next) {
  const result = validateUpdateTodo(req.body);
  if (!result.isValid) {
    return sendError(res, 400, result.message);
  }
  next();
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateCreateTodoInput,
  validateUpdateTodoInput,
};
