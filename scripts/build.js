#!/usr/bin/env node

const process = require('process');
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

async function clean() {
  try {
    const cleanProcessPromise = util.promisify(childProcess.exec);
    const result = await cleanProcessPromise(`yarn clean`, { stdio: 'inherit', cwd: process.cwd(), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON CLEAN: ${error}\n`);
    process.exit(1);
  }
}

async function installForBuild() {
  try {
    const cleanProcessPromise = util.promisify(childProcess.exec);
    const result = await cleanProcessPromise(`yarn install`, { stdio: 'inherit', cwd: process.cwd(), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON INSTALL FOR BUILD: ${error}\n`);
    process.exit(2);
  }
}

async function build() {
  try {
    const buildProcessPromise = util.promisify(childProcess.exec);
    const result = await buildProcessPromise(`yarn build`, { stdio: 'inherit', cwd: process.cwd(), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}\n`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON BUILD: ${error}\n`);
    process.exit(3);
  }
}

async function copyDirectory(source, target) {
  try {
    if (!fs.existsSync(target)) {
      await fs.promises.mkdir(target);
    }
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      if ((await fs.promises.lstat(sourcePath)).isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await fs.promises.copyFile(sourcePath, targetPath);
      }
    }
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON COPY DIRECTORY: ${error}\n`);
    process.exit(4);
  }
}

async function copyFile(source, target) {
  try {
    await fs.promises.copyFile(source, target);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON COPY FILE: ${error}\n`);
    process.exit(5);
  }
}

async function test() {
  try {
    const testProcessPromise = util.promisify(childProcess.exec);
    const result = await testProcessPromise(`yarn test`, { stdio: 'inherit', cwd: process.cwd(), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON TEST: ${error}\n`);
    process.exit(6);
  }
}

async function lint() {
  try {
    const lintProcessPromise = util.promisify(childProcess.exec);
    const result = await lintProcessPromise(`yarn lint`, { stdio: 'inherit', cwd: process.cwd(), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON LINT: ${error}\n`);
    process.exit(7);
  }
}

async function removeDevelopmentDependencies() {
  try {
    const packageJsonFilePath = path.resolve(process.cwd(), 'dist/package.json');
    const packageJsonText = await fs.promises.readFile(packageJsonFilePath, { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageJsonText);
    delete packageJson.devDependencies;
    delete packageJson.scripts;
    await fs.promises.writeFile(packageJsonFilePath, JSON.stringify(packageJson, null, 2) ,{ encoding: 'utf-8' });
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON REMOVE DEVELOPMENT DEPENDENCIES: ${error}\n`);
    process.exit(8);
  }
}

async function installForRuntime() {
  try {
    const installProcessPromise = util.promisify(childProcess.exec);
    const result = await installProcessPromise(`yarn install`, { stdio: 'inherit', cwd: path.resolve(process.cwd(), 'dist'), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON INSTALL FOR RUNTIME: ${error}\n`);
    process.exit(9);
  }
}

async function createEntrypoint() {
  try {
    const entryPointFileText = [
      '#!/usr/bin/env sh',
      'node --inspect=0.0.0.0:9229 ./src/main.js'
    ].join('\n');
    const addExecutionRightsProcessPromise = util.promisify(childProcess.exec);
    const entrypointFilePath = path.resolve(process.cwd(), 'dist/entrypoint.sh');
    await fs.promises.writeFile(entrypointFilePath, entryPointFileText, { encoding: 'utf-8' });
    const result = await addExecutionRightsProcessPromise(`chmod +x entrypoint.sh`, { stdio: 'inherit', cwd: path.resolve(process.cwd(), 'dist'), shell: '/bin/sh' });
    process.stdout.write(`${result.stdout.toString()}`);
  } catch (error) {
    process.stderr.write(`BUILD FAILED ON CREATE ENTRYPOINT: ${error}\n`);
    process.exit(10);
  }
}

async function main() {
  await clean();
  await installForBuild();
  await build();
  await copyDirectory(path.resolve(process.cwd(), 'src/views'), path.resolve(process.cwd(), 'dist/src/views/'));
  await copyDirectory(path.resolve(process.cwd(), 'public'), path.resolve(process.cwd(), 'dist/public/'));
  await copyFile(path.resolve(process.cwd(), 'package.json'), path.resolve(process.cwd(), 'dist/package.json'));
  await test();
  await lint();
  await removeDevelopmentDependencies();
  await installForRuntime();
  await createEntrypoint();
  process.stdout.write(`BUILD SUCCESS\n`);
  process.exit(0);
}

main();
