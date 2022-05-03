const child = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rootPackage = require('../package.json');

const gitBranch = child.execSync('git branch --show-current');

if (gitBranch.toString() !== 'master\n') {
  console.log('You are not on the master branch. Please switch to master before publishing.');
  process.exit(1);
}

console.log('Current root version:', rootPackage.version);
console.log('Workspaces:', rootPackage.workspaces);

let conflict = false;

rootPackage.workspaces.forEach((p) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const packageJson = require(`../${p}/package.json`);

  if (packageJson.version !== rootPackage.version) {
    console.log(`${p} is version ${packageJson.version}. ${rootPackage.version} is needed.`);
    conflict = true;
  } else {
    console.log(`${p} is version OK`);
  }
});

console.log('------------------------');
if (conflict) {
  readline.question(
    `Some version conflicts found. Change all to ${rootPackage.version}? Y/n`,
    (a) => {
      readline.close();

      if (a === '' || a.toLowerCase() === 'y') {
        const names = [];

        rootPackage.workspaces.forEach((p) => {
          // eslint-disable-next-line import/no-dynamic-require,global-require
          const packageJson = require(`../${p}/package.json`);
          packageJson.version = rootPackage.version;

          // also update internal dependencies
          names.forEach((n) => {
            if (!packageJson.dependencies[n]) {
              return;
            }

            packageJson.dependencies[n] = `^${rootPackage.version}`;
          });

          // eslint-disable-next-line import/no-dynamic-require,global-require
          const fs = require('fs');
          fs.writeFileSync(`${p}/package.json`, JSON.stringify(packageJson, null, 2));

          names.push(packageJson.name);
        });
        console.log('------------------------');
        console.log('Changed versions. Committing changes...');

        child.execSync('git add .');
        child.execSync(`git commit -m "chore: bumped packages to version: ${rootPackage.version}"`);
        child.execSync('git push origin master');
        process.exit(0);
      } else {
        console.log('------------------------');
        console.log('Cancelled publishing');
        process.exit(1);
      }
    },
  );
} else {
  process.exit(0);
}
