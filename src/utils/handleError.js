const handleError = (type, domain, err) => {
  if (err.code === 'ENODATA') {
    console.error(`No ${type} record found for ${domain}`);
  } else if (err.code === 'SERVFAIL') {
    console.error(`DNS server failure while fetching ${type} for ${domain}`);
  } else if (err.code === 'NXDOMAIN') {
    console.error(`Domain ${domain} does not exist`);
  } else {
    console.error(`Error fetching ${type} for ${domain}: `, err);
  }
  return null;
};

module.exports = { handleError };
