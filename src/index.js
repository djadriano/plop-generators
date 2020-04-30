#!/usr/bin/env node

const chalk = require('chalk');
const nodePlop = require('node-plop');
const plop = nodePlop(`${__dirname}/plopfile.js`);

const { argv } = process;
const isTemplate = argv.includes('template');
const generatorName = isTemplate ? 'template' : 'component';

const logChange = line => console.log(chalk.green('✔ ++'), line.path);

const logFailure = (line) => {
  const logs = [chalk.red('✖  ++')];

  if (line.type) { logs.push(line.type); }
  if (line.path) { logs.push(line.path); }

  const error = line.error || line.message;

  logs.push(chalk.red(error));

  console.log(...logs);
};

const runGenerator = async () => {
  const generator = plop.getGenerator(generatorName);

  try {
    const opts = await generator.runPrompts()
    const result = await generator.runActions(opts);

    result.changes.forEach(logChange);
    result.failures.forEach(logFailure);

  } catch (err) {
    console.error(chalk.red('[ERROR]'), err.message);
    throw err;
  }
};

runGenerator();