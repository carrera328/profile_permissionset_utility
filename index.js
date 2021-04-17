const fs = require('fs');
const convert = require('xml-js');
const parser = require('json2csv');
const path = require('path');
const helper = require('./helpers.js');
const constants = require('./constants.js');
const util = require('util');

// TODO: get profiles from arguments
const argv = require('minimist')(process.argv.slice(2));

// CLI flags
const directory = argv.dir + '/';
const csv = argv.csv;

if (!directory) {
    console.error(constants.messaging.FAIL,`please include the directory after the dir flag: --dir, e.g. --dir /users/atriumdev/documents`);
    return false;
}

if (!csv) {
    console.error(constants.messaging.FAIL, `please include the path to a valid csv after the csv flag: --csv, e.g. --csv /users/atriumdev/documents/sample.csv`);
    return false;
}
 
if (!helper.validateProfileDir(directory)) {
    console.error(constants.messaging.FAIL, 'Error: please enter a valid profile directory with your stupid ass');
    return false;
} 
let profiles = [];

// main
(async () => {
    profiles = await helper.profileArray(directory);
    profiles.forEach((profile) => console.log(directory + profile));
    const result = await helper.convertData(path.resolve(directory + profiles[0]), 'xml');
    const result2 = await helper.convertData('./output.json', 'json');
    console.log(result2);

    console.log(result);
})();

console.log(constants.messaging.SUCCESS, 'bruh you\'re finally done, you can stop pretending to be a dev now');





