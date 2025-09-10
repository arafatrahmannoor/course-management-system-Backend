const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/checkAuth');
const { purchaseCourse, getUserPurchases } = require('../controller/purchaseController');

// User: purchase a course
router.post('/buy', checkAuth, purchaseCourse);
// User: view purchased courses
router.get('/my', checkAuth, getUserPurchases);

module.exports = router;
