const fs = require('fs');
const { ncp } = require('ncp');
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
        console.error(err);
        return;
      }

      console.info(`Copied ${from} to ${to}`);

      rimraf(`${root}/${name}/lib/declarations`, () => {
        if (err) {
          console.error(err);
          return;
        }

        console.info(`Cleaned up ${to}`);
      });
    },
  );
});
