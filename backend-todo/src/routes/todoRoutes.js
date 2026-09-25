const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateCreateTodoInput,
  validateUpdateTodoInput,
} = require('../middleware/validationMiddleware');

// All todo routes require authentication
router.use(authMiddleware);

// Todo CRUD routes
router.post('/', validateCreateTodoInput, TodoController.createTodo);
router.get('/', TodoController.getTodos);
router.get('/:id', TodoController.getTodoById);
router.put('/:id', validateUpdateTodoInput, TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
