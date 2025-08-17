#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).options({
  t: { alias: 'tracker', demandOption: true, type: 'string' },
  d: { alias: 'data', demandOption: true, type: 'string' },
}).argv;

const trackerData = {};
let dataFile = `${argv.data}.json`;

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, '{}');
}

try {
  trackerData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
} catch (error) {
  console.error(`Error reading data file: ${error}`);
  process.exit(1);
}

const tracker = argv.tracker;

if (trackerData[tracker]) {
  console.log(`Tracker "${tracker}" already exists:`);
  console.log(trackerData[tracker]);
} else {
  trackerData[tracker] = {};
  fs.writeFileSync(dataFile, JSON.stringify(trackerData, null, 2));
  console.log(`Tracker "${tracker}" created successfully.`);
}

const commands = {
  add: (key, value) => {
    trackerData[tracker][key] = value;
    fs.writeFileSync(dataFile, JSON.stringify(trackerData, null, 2));
    console.log(`Added key-value pair "${key}" = "${value}" to tracker "${tracker}".`);
  },
  remove: (key) => {
    delete trackerData[tracker][key];
    fs.writeFileSync(dataFile, JSON.stringify(trackerData, null, 2));
    console.log(`Removed key-value pair "${key}" from tracker "${tracker}".`);
  },
  list: () => {
    console.log(`Tracker "${tracker}" has the following key-value pairs:`);
    console.log(trackerData[tracker]);
  },
};

if (argv._.length > 0) {
  const command = argv._[0];
  if (Object.keys(commands).includes(command)) {
    if (command === 'add') {
      if (argv._.length !== 3) {
        console.error('Usage: q3co_implement_a_dat.js <tracker> <data> add <key> <value>');
        process.exit(1);
      }
      commands[command](argv._[1], argv._[2]);
    } else if (command === 'remove') {
      if (argv._.length !== 2) {
        console.error('Usage: q3co_implement_a_dat.js <tracker> <data> remove <key>');
        process.exit(1);
      }
      commands[command](argv._[1]);
    } else if (command === 'list') {
      commands[command]();
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
} else {
  console.log('Usage: q3co_implement_a_dat.js <tracker> <data> add <key> <value>');
  console.log('       q3co_implement_a_dat.js <tracker> <data> remove <key>');
  console.log('       q3co_implement_a_dat.js <tracker> <data> list');
}