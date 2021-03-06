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
    performJob: async(file, csv, operation, type) => {
        let jsonMeta = await helper.convertData(path.normalize(file), 'json');
        //manipulate layouts chunk
        let newMetadata = await csvtojsonV2().fromFile(csv).then((jsonObj) => jsonObj);
        jsonMeta[type][operation] = pluck(newMetadata);
        fs.writeFileSync('incomingMetadata.json', JSON.stringify(newMetadata, null, 4));
        fs.writeFileSync('stage.json', JSON.stringify(jsonMeta, null, 4));
        const last = file.split('/');
        if (!fs.existsSync(`./results/${operation}`)) {
            fs.mkdirSync(`./results/${operation}`);
        } 
      
        helper.convertData('stage.json', 'xml', `./results/${operation}/${last[last.length - 1]}`);
        await helper.clean(['incomingMetadata.json', 'stage.json', 'output.json']);
        console.log(messaging.SUCCESS,`done`);
    },

    getMetadataType: async (file) => {
        const jsonFormat =  helper.convertData(path.normalize(file), 'json');
        if (jsonFormat.hasOwnProperty('Profile')) {
            return 'Profile';
        } else if(jsonFormat.hasOwnProperty('PermissionSet')) {
            return 'PermissionSet';
        } else {
            console.error(messaging.FAIL, 'Profile or Permissionset attribute not found in object');
            return false;
        }
    }
}