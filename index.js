const fs = require('fs');
const path = require('path');
const helper = require('./helpers.js');
const constants = require('./constants.js');
const csvtojsonV2=require("csvtojson");
const { pluck } = require('./helpers.js');

// TODO: get profiles from arguments
const argv = require('minimist')(process.argv.slice(2));

// CLI flags
const directory = argv.dir + '/';
const file = argv.file;
const csv = argv.csv;

if (!file) {
    console.error(constants.messaging.FAIL,`please include the path to the profile after the file flag: --file, e.g. --file /users/atriumdev/documents/file.name`);
    return false;
}

if (!csv) {
    console.error(constants.messaging.FAIL, `please include the path to a valid csv after the csv flag: --csv, e.g. --csv /users/atriumdev/documents/sample.csv`);
    return false;
}
 //TODO: bulkify application to process multiple profiles at once
// if (!helper.validateProfileDir(directory)) {
//     console.error(constants.messaging.FAIL, 'Error: please enter a valid profile directory with your stupid ass');
//     return false;
// } 
//let profiles = [];

// main
(async () => {
    //TODO: convert profile to JSON
    let jsonProfile = await helper.convertData(path.normalize(file), 'json');

    //TODO: extract layouts portion of profile
    const layoutChunk = {layoutAssignments: jsonProfile.Profile.layoutAssignments};
    fs.writeFileSync('chunk.json', JSON.stringify(layoutChunk, null, 4));
    helper.convertData('chunk.json', 'xml', 'chunk.xml');
    
    //TODO: manipulate layouts chunk
    let layoutMetadata = await csvtojsonV2().fromFile(csv).then((jsonObj) => jsonObj);
    layoutMetadata = {layoutAssignments: pluck(layoutMetadata)};
    fs.writeFileSync('incomingLayoutMetadata.json', JSON.stringify(layoutMetadata, null, 4));

    //TODO: replace existing chunk with new chunk
    jsonProfile.Profile.layoutAssignments = layoutMetadata.layoutAssignments;
    fs.writeFileSync('stage.json', JSON.stringify(jsonProfile, null, 4));
    const last = file.split('/');
    
    await helper.convertData('stage.json', 'xml', `${last[last.length - 1]}`);
     
})();








