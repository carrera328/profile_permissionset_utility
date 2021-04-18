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
    //profiles.forEach((profile) => console.log(directory + profile));
    const jsonProfile = await helper.convertData(path.resolve(directory + profiles[0]), 'json');

    const xmlProfile = helper.convertData('output.json', 'xml', 'dash.xml');
    
    //console.log(xmlProfile);
    
    // //TODO: extract layouts portion of profiles
    console.log(jsonProfile.Profile.layoutAssignments);
    const layoutChunk = {layoutAssignments: jsonProfile.Profile.layoutAssignments}

    fs.writeFileSync('chunk.json', JSON.stringify(layoutChunk, null, 4));
   
    const test = helper.convertData('chunk.json', 'xml', 'ass.xml');
    

    let fields = ['layout._text', 'recordType._text'];
    let json2csv = new Parser({fields}); 
    
    const layoutMetadata = await csvtojsonV2().fromFile('AMER_Analyst_Layout_Assignment_API.csv').then((jsonObj) => jsonObj);
    //console.log(layoutMetadata);
    // //TODO: manipulate layouts chunk
    const stuffs = pluck(layoutMetadata);
    fs.writeFileSync('pluckedjson.json', JSON.stringify(stuffs, null, 4));
    // //TODO: replace existing chunk with new chunk
    
    
     const newerXml = await helper.convertData('pluckedjson.json', 'xml', 'oliver.xml');

    // fs.writeFileSync('fucking_shit.xml', newerXml);
    
  
})();

console.log(constants.messaging.SUCCESS, 'bruh you\'re finally done, you can stop pretending to be a dev now');






