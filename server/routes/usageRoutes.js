const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');

router.get('/', usageController.getAllUsage);
router.post('/', usageController.createUsage);
router.put('/:id', usageController.updateUsage);
router.delete('/', usageController.clearAllUsage); 
router.delete('/:id', usageController.deleteUsage); 

module.exports = router;
