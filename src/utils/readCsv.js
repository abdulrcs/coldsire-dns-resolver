const fs = require('fs');
const csv = require('csv-parser');

const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const domains = [];
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        domains.push(row[Object.keys(row)[0]]);
      })
      .on('end', () => {
        resolve(domains);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

module.exports = readCsv;
