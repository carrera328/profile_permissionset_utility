const fs = require('fs');
const path = require('path');
const {
    xml2js,
    js2xml,
} = require('xml-js');
const {
    messaging
} = require('./constants');

module.exports = {
    // TODO: BULKIFY APPLICATION
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
    clean: (listOfFiles) => {
        listOfFiles.forEach((file) => {
            fs.unlink(file, (err) => {
                if (err) {
                    console.error(messaging.FAIL, err);
                    return;
                }
            })
        })
    }
    
}