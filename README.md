# Profile Utility
Profile Utility is a Node.JS CLI application that manipulates profiles and permissionsets programatically based on CSV input. Profiles loaded into the tool are converted to JSON, manipulated in JavaScript then converted back to XML. 

## Dependencies
* Node v15.2.0 or greater

## Installation
`git clone https://github.com/AtriumAI/profile_utility`  
`cd profile_utility`  
`npm install`  

## How to use

* open the root directory of the application in a terminal
* run a command structured in the following format:
`npm run start -- --csv PATH/TO/CSV --file PATH/TO/VALID/"PROFILE NAME WRAPPED IN QUOTES"`

The --csv and --file flags are required, the tool will not work without these arguments

The Profile Utlity will generate several files including a copy of the original profile with the new modifications:  

* output.json - the original profile formatted into JSON
* chunk.json - only the layout section of the profile in JSON
* chunk.xml - XML representation of chunk.json
* incomingLayoutMetadata.json - JSON representation of the CSV that was loaded in the --file command
* stage.json - original profile JSON with new metadata spliced in
* FILE_NAME.profile - the new profile in profile format
