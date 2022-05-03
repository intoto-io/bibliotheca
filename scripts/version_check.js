const rootPackage = require('../package.json');

console.log('Current root version:', rootPackage.version);
console.log('Workspaces:', rootPackage.workspaces);

let abort = false;

rootPackage.workspaces.forEach((p) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const packageJson = require(`../${p}/package.json`);

  if (packageJson.version !== rootPackage.version) {
    console.log(`${p} is version ${packageJson.version}. ${rootPackage.version} is needed.`);
    abort = true;
  } else {
    console.log(`${p} is version OK`);
  }
});

if (abort) {
  console.log('------------------------');
  console.log('Check for errors above.');
  process.exit(1);
}
