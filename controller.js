const fs = require('fs');
const path = require('path');
const {
    xml2js,
    js2xml,
} = require('xml-js');
const {
    messaging
} = require('./constants');
const util = require('util');
const csvtojsonV2=require("csvtojson");
const { pluck } = require('./helpers.js');
const helper = require('./helpers.js');


module.exports = {
    layoutAssignment: async (file, csv) => {
        let jsonProfile = await helper.convertData(path.normalize(file), 'json');

        //TODO: extract layouts portion of profile
        const layoutChunk = {
            layoutAssignments: jsonProfile.Profile.layoutAssignments
        };
        fs.writeFileSync('chunk.json', JSON.stringify(layoutChunk, null, 4));
        helper.convertData('chunk.json', 'xml', 'chunk.xml');

        //TODO: manipulate layouts chunk
        let layoutMetadata = await csvtojsonV2().fromFile(csv).then((jsonObj) => jsonObj);
        layoutMetadata = {
            layoutAssignments: pluck(layoutMetadata)
        };
        fs.writeFileSync('incomingLayoutMetadata.json', JSON.stringify(layoutMetadata, null, 4));

        //TODO: replace existing chunk with new chunk
        jsonProfile.Profile.layoutAssignments = layoutMetadata.layoutAssignments;
        fs.writeFileSync('stage.json', JSON.stringify(jsonProfile, null, 4));
        const last = file.split('/');
        
        await helper.convertData('stage.json', 'xml', `${last[last.length - 1]}`);

    }    
}