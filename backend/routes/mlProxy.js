const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://aifitness-1.onrender.com';

// Proxy middleware to handle ML service requests
router.use('/:endpoint', auth, async (req, res) => {
  try {
    const { endpoint } = req.params;
    const mlServiceEndpoint = `${ML_SERVICE_URL}/api/${endpoint}`;
    
    const response = await axios({
      method: req.method,
      url: mlServiceEndpoint,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML Service proxy error:', error.message);
    
    if (error.response) {
      // ML service responded with error status
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // No response received from ML service
      res.status(503).json({ 
        message: 'ML service is temporarily unavailable',
        error: 'Service Unavailable'
      });
    } else {
      // Other errors
      res.status(500).json({ 
        message: 'Error connecting to ML service',
        error: error.message
      });
    }
  }
});

module.exports = router;