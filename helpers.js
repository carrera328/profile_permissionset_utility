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
    convertData: (profile, format, file) => {
        if (profile && format) {
            switch (format) {
                case 'json': {
                    let xml = fs.readFileSync(profile);
                    const json = xml2js(xml, {
                        compact: true,
                        spaces: 4
                    });
                    fs.writeFileSync('output.json', JSON.stringify(json, null, 4));
                    return json;
                }
                case 'xml':
                    try {
                        let json = fs.readFileSync(profile);

                        if (typeof json !== Object) json = JSON.parse(json);

                        const xml = js2xml(json, {
                            compact: true,
                            ignoreComment: true,
                            spaces: 4
                        });
                        fs.writeFileSync(file, xml);
                        return xml;
                    } catch (err) {
                        console.error(messaging.SUCCESS, err)
                    }
            }
        } else console.error(messaging.WARNING, 'something is wrong here');
    },
    pluck: (metadata) => {
        for (let i = 0; i < metadata.length; i++) {
            if (!metadata[i].recordType._text) delete metadata[i].recordType;
        }
        return metadata;
    },

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