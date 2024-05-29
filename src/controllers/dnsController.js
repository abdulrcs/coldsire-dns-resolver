const Domain = require('../models/domain');
const readCsv = require('../utils/readCsv');
const {
  lookupSPF,
  lookupDKIM,
  lookupDMARC,
} = require('../services/dnsService');

const checkDNSRecords = async (req, res) => {
  try {
    const domains = await readCsv('./src/dataset/domain_names.csv');
    const dnsPromises = domains.map(async (domain) => {
      let is_valid = true;
      let invalids = [];
      let error = '';

      const spf = await lookupSPF(domain);
      if (!spf) {
        is_valid = false;
        invalids.push('SPF');
      }

      let selectors = [];
      if (spf && spf.includes('google.com')) {
        selectors = ['default', 'google'];
      } else if (spf && spf.includes('outlook.com')) {
        selectors = ['selector1', 'selector2'];
      } else {
        selectors = ['default'];
      }

      const dkim = await lookupDKIM(domain, selectors);
      if (!dkim) {
        is_valid = false;
        invalids.push('DKIM');
      }

      const dmarc = await lookupDMARC(domain);
      if (!dmarc) {
        is_valid = false;
        invalids.push('DMARC');
      }

      if (invalids.length) {
        error = `Invalid records: ${invalids.join(', ')}`;
      } else {
        error = null;
      }

      return { name: domain, spf, dkim, dmarc, is_valid, error };
    });

    const dnsResults = await Promise.all(dnsPromises);

    await Domain.bulkWrite(
      dnsResults.map((result) => ({
        updateOne: {
          filter: { name: result.name },
          update: {
            $set: {
              name: result.name,
              is_valid: result.is_valid,
              spf: result.spf,
              dkim: result.dkim,
              dmarc: result.dmarc,
              error: result.error,
              last_checked: new Date(),
            },
          },
          upsert: true,
        },
      }))
    );

    res.status(200).json(dnsResults);
  } catch (error) {
    console.error('Error processing DNS records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDomains = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = Number(page);
  limit = Number(limit);

  const count = await Domain.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const offset = (page - 1) * limit;

  let domains;

  domains = await Domain.find()
    .limit(limit * 1)
    .skip(offset);

  res.status(200).json({
    data: domains,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      limit,
    },
  });
};

module.exports = { checkDNSRecords, getDomains };
