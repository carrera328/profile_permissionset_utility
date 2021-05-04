# Profile-Permissionset-Utility
Profile Utility is a Node.JS CLI tool that manipulates profiles and permissionsets programatically based on CSV input. Profiles/permissionsets loaded into the tool are converted to JSON, manipulated in JavaScript then converted back to XML. 

## Dependencies
* Node v15.2.0 or greater

## Installation
`git clone https://github.com/AtriumAI/profile_utility`  
`cd profile_utility`  
`npm install`  

## How to use

* open the root directory of the application in a terminal
* run a command structured in the following format:  
* `npm run start --` required boilerplate node command<br>
* `--csv ./PATH/TO/VALID/CSV/FILE` path to csv that the tool will take as input.<br>
* `--file ./PATH/TO/VALID/"PROFILE-PERMISSIONSET"` path to profile/permissionset to be modified, file name should be wrapped in quotes, original file will not be edited, only the copy generated.<br>
* `--layoutAssignment` command that invokes layoutAssignment functionality CANNOT BE USED IN CONJUNCTION WITH THE recordTypeAssignment COMMAND<br>
* `--recordTypeAssignment` command that invokes recordTypeAssignment functionality CANNOT BE USED IN CONJUNCTION WITH THE recordTypeAssignment COMMAND<br>

**layout assignment example:**<br>
`npm run start -- --csv ./layout-assignment-sample.csv --file ./"Sales Admin.profile" --layoutAssignment`<br><br>
**recordType assignment:**<br>
`npm run start -- --csv ./recordtype-assignment-sample.csv --file ./"Sample.permissionset" --recordTypeAssignment`


The --csv,--file and either the --layoutAssignment or (but not both) --recordTypeAssignment flags are required, the tool will not work without these arguments

results are generated in results folder
