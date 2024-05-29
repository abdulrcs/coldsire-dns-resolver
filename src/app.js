const express = require('express');
const connectDB = require('./config/database');
const domainRoutes = require('./routes/domains');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/domains', domainRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { checkDNSRecords } = require('./controllers/dnsController');
// runs every day at midnight
cron.schedule('0 0 * * *', checkDNSRecords);
