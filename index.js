const helper = require('./helpers.js');
const constants = require('./constants.js');
const controller = require('./controller.js');
const { messaging } = require('./constants.js');

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



// main
(async () => {

    const type = await controller.getMetadataType(file);
    console.log(type);
    try {
        await controller.layoutAssignment(file, csv, type);
    } catch(err) {
        console.error(messaging.WARNING, err);
    }
   
    
})();












