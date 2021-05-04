const helper = require('./helpers.js');
const constants = require('./constants.js');
const controller = require('./controller.js');
const { messaging } = require('./constants.js');

const argv = require('minimist')(process.argv.slice(2));

// CLI flags
const directory = argv.dir + '/';
const file = argv.file;
const csv = argv.csv;
const layoutAssignment = argv.layoutAssignment;
const recordTypeAssignment = argv.recordTypeAssignment;

if (!file) {
    console.error(constants.messaging.FAIL,`please include the path to the profile after the file flag: --file, e.g. --file /users/atriumdev/documents/file.name`);
    return false;
}

if (!csv) {
    console.error(constants.messaging.FAIL, `please include the path to a valid csv after the csv flag: --csv, e.g. --csv /users/atriumdev/documents/sample.csv`);
    return false;
}

if (!layoutAssignment && !recordTypeAssignment) {
    console.error(messaging.FAIL, `Please include either one of the --layoutAssignment or --recordTypeAssignment flags in your input`);
}


// main
(async () => {
    const type = await controller.getMetadataType(file);
    //console.log(type);
    // TODO: case statement on flags passed in
    try {
        //await controller.layoutAssignmentJob(file, csv, type);
        if (layoutAssignment && recordTypeAssignment) {
            throw new Error('¯\\_(ツ)_/¯ Please only select one service');
        }

        if (layoutAssignment && !recordTypeAssignment) {
            await controller.performJob(file, csv, 'layoutAssignments', type);
            return;
            
        }

        if (!layoutAssignment && recordTypeAssignment) {
            await controller.performJob(file, csv, 'recordTypeVisibilities', type);
            return;
        }
        
         
    } catch(err) {
        console.error(messaging.WARNING, err);
    }

    //console.log(argv);


})();












