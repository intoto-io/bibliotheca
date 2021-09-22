const fs = require('fs');
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');

const root = `${__dirname}/../packages`;
const packages = fs.readdirSync(root);

packages.forEach((name) => {
  const from = `${name}/lib/declarations/${name}`;
  const to = `${name}/lib`;

  ncp(
    `${root}/${from}`,
    `${root}/${to}`,
    (err) => {
      if (err) {
        return console.error(err);
      }

      console.info(`Copied ${from} to ${to}`);

      rimraf(`${root}/${name}/lib/declarations`, () => {
        if (err) {
          return console.error(err);
        }

        console.info(`Cleaned up ${to}`);
      });
    }
  );
});
