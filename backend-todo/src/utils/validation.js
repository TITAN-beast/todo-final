/**
 * Input validation helpers
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates registration input
 * @param {object} data
 * @returns {{ isValid: boolean, message?: string }}
 */
function validateRegistration(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: 'Request body must be a valid JSON object' };
  }

  const { name, email, password } = data;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required and cannot be empty' };
  }

  if (name.trim().length < 2 || name.trim().length > 100) {
    return { isValid: false, message: 'Name must be between 2 and 100 characters' };
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, message: 'A valid email address is required' };
  }

  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6 || password.length > 128) {
    return { isValid: false, message: 'Password must be between 6 and 128 characters' };
  }

  return { isValid: true };
}

/**
 * Validates login input
 * @param {object} data
 * @returns {{ isValid: boolean, message?: string }}
 */
function validateLogin(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: 'Request body must be a valid JSON object' };
  }

  const { email, password } = data;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, message: 'A valid email address is required' };
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return { isValid: false, message: 'Password is required' };
  }

  return { isValid: true };
}

/**
 * Validates todo creation input
 * @param {object} data
 * @returns {{ isValid: boolean, message?: string }}
 */
function validateCreateTodo(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: 'Request body must be a valid JSON object' };
  }

  const { title, description } = data;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { isValid: false, message: 'Title is required and cannot be empty' };
  }

  if (title.trim().length > 255) {
    return { isValid: false, message: 'Title cannot exceed 255 characters' };
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return { isValid: false, message: 'Description must be a string if provided' };
  }

  return { isValid: true };
}

/**
 * Validates todo update input
 * @param {object} data
 * @returns {{ isValid: boolean, message?: string }}
 */
function validateUpdateTodo(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: 'Request body must be a valid JSON object' };
  }

  const { title, description, completed } = data;

  // At least one field must be provided for update
  if (title === undefined && description === undefined && completed === undefined) {
    return { isValid: false, message: 'At least one field (title, description, completed) must be provided to update' };
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return { isValid: false, message: 'Title cannot be empty' };
    }
    if (title.trim().length > 255) {
      return { isValid: false, message: 'Title cannot exceed 255 characters' };
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    return { isValid: false, message: 'Description must be a string' };
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return { isValid: false, message: 'Completed must be a boolean value (true or false)' };
  }

  return { isValid: true };
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateCreateTodo,
  validateUpdateTodo,
};
