const express = require('express');
const { checkDNSRecords, getDomains } = require('../controllers/dnsController');
const router = express.Router();

router.post('/check', checkDNSRecords);
router.get('/', getDomains);

module.exports = router;
