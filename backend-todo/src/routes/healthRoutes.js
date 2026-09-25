const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../utils/response');

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/', (req, res) => {
  return sendSuccess(res, 200, 'Todo API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
