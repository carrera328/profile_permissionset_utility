const fs = require('fs');
const {json2csv} = require('xml-js');
const {Parser} = require('json2csv');
const path = require('path');
const helper = require('./helpers.js');
const constants = require('./constants.js');
const csvtojsonV2=require("csvtojson");
const { pluck } = require('./helpers.js');

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
    let jsonProfile = await helper.convertData(path.resolve(directory + profiles[0]), 'json');

    // //TODO: extract layouts portion of profiles
    const layoutChunk = {layoutAssignments: jsonProfile.Profile.layoutAssignments};
    fs.writeFileSync('chunk.json', JSON.stringify(layoutChunk, null, 4));
    helper.convertData('chunk.json', 'xml', 'chunk.xml');
    
    // //TODO: manipulate layouts chunk
    let layoutMetadata = await csvtojsonV2().fromFile('AMER_Analyst_Layout_Assignment_API.csv').then((jsonObj) => jsonObj);
    layoutMetadata = {layoutAssignments: pluck(layoutMetadata)};
    fs.writeFileSync('incomingLayoutMetadata.json', JSON.stringify(layoutMetadata, null, 4));

    // //TODO: replace existing chunk with new chunk
    jsonProfile.Profile.layoutAssignments = layoutMetadata.layoutAssignments;
    fs.writeFileSync('stage.json', JSON.stringify(jsonProfile, null, 4));
    await helper.convertData('stage.json', 'xml', `${profiles[0]}`)
     
})();








