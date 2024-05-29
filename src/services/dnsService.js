const { handleError } = require('../utils/handleError');

const dns = require('dns').promises;

const lookupSPF = async (domain) => {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records.find((record) =>
      record.join('').startsWith('v=spf1')
    );
    return spfRecord ? spfRecord.join('') : null;
  } catch (err) {
    handleError('SPF', domain, err);
    return null;
  }
};

const lookupDKIM = async (domain, selectors) => {
  let records = null;
  for (const selector of selectors) {
    try {
      console.log(selector + '._domainkey.' + domain);
      records = await dns.resolveTxt(`${selector}._domainkey.${domain}`);
      if (records.length) {
        console.log(
          `Found DKIM record for ${domain} with selector ${selector}`
        );
        return records[0].join('');
      } else if (selector === selectors[selectors.length - 1]) {
        console.log(`No DKIM record found for ${domain}`);
        return null;
      }
    } catch (err) {
      handleError('DKIM', domain, err);
    }
  }
  return null;
};

const lookupDMARC = async (domain) => {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.find((record) =>
      record.join('').startsWith('v=DMARC1')
    );
    return dmarcRecord ? dmarcRecord.join('') : null;
  } catch (err) {
    handleError('DMARC', domain, err);
    return null;
  }
};

module.exports = { lookupSPF, lookupDKIM, lookupDMARC };
