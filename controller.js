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
    layoutAssignment: async (file, csv, type) => {
        if (type != 'Profile') throw new Error('Layout assignment only available for Profiles, you know what I mean?');
        
        let jsonProfile = await helper.convertData(path.normalize(file), 'json');
        //extract layouts portion of profile
        const layoutChunk = {
            layoutAssignments: jsonProfile.Profile.layoutAssignments
        };
        fs.writeFileSync('chunk.json', JSON.stringify(layoutChunk, null, 4));
        helper.convertData('chunk.json', 'xml', 'chunk.xml');

        //manipulate layouts chunk
        let layoutMetadata = await csvtojsonV2().fromFile(csv).then((jsonObj) => jsonObj);
        layoutMetadata = {
            layoutAssignments: pluck(layoutMetadata)
        };
        fs.writeFileSync('incomingMetadata.json', JSON.stringify(layoutMetadata, null, 4));

        //replace existing chunk with new chunk
        jsonProfile.Profile.layoutAssignments = layoutMetadata.layoutAssignments;
        fs.writeFileSync('stage.json', JSON.stringify(jsonProfile, null, 4));
        const last = file.split('/');
        helper.convertData('stage.json', 'xml', `${last[last.length - 1]}`);
        await helper.clean(['chunk.json', 'chunk.xml', 'incomingMetadata.json', 'stage.json', 'output.json']);
    },

    getMetadataType: async (file) => {
        const jsonFormat =  helper.convertData(path.normalize(file), 'json');
        if (jsonFormat.hasOwnProperty('Profile')) {
            return 'Profile';
        } else if(jsonFormat.hasOwnProperty('PermissionSet')) {
            return 'Permissionset';
        } else {
            console.error(messaging.FAIL, 'Profile or Permissionset attribute not found in object');
            return false;
        }

    }
}