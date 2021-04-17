const fs = require('fs');
const path = require('path');
const {
    xml2js,
    js2xml
} = require('xml-js');
const {
    messaging
} = require('./constants');
const util = require('util');
module.exports = {
    // TODO: Create functionality that determines if the profile directory is in either source or metadata api format
    metadataFormat: "",
    validateProfileDir: (dir) => {
        let validated = true;
        let record;
        try {
            record = fs.readdirSync(dir)[0];
        } catch (err) {
            console.error(messaging.FAIL, err);
        }
        fs.readdirSync(dir).forEach(file => {
            try {
                // check if current item is a file and if it has profile in its URL
                if (!fs.statSync(`${dir}/${record}`).isFile() || !path.basename(fs.readdirSync(dir)[0]).split('.')[1].includes('profile')) {
                    validated = false;
                }
            } catch (err) {
                console.error(messaging.FAIL, err);
                return;
            }
        })
        console.log(`Am I validated? : ${validated}`);
        return validated;
    },
    profileArray: async (dir) => {
        const profileArray = [];
        try {
            await fs.readdirSync(dir).forEach(file => {
                profileArray.push(file);
            });
        } catch (err) {
            console.error(err);
        }
        return profileArray;
    },
    convertData: (profile, format) => {
        if (profile && format) {
            switch (format) {
                case 'xml': {
                    let xml = fs.readFileSync(profile);
                    const json = xml2js(xml, {
                        compact: false,
                        spaces: 4
                    });
                    fs.writeFileSync('output.json', JSON.stringify(json, null, 4));
                    return json;
                }

                case 'json': {
                    let json = fs.readFileSync(profile);
                    if (typeof json !== Object) json = JSON.parse(json);
                    const xml = js2xml(json, {
                        compact: false,
                        ignoreComment: true,
                        spaces: 4
                    });
                    fs.writeFileSync('output.xml', xml);
                    return xml;
                }
            }
        } else console.error(messaging.WARNING, 'something is wrong here');
    }

}