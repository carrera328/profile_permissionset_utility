# Profile Utility
Profile Utility is a Node.JS CLI application that manipulates profiles and permissionsets programatically based on CSV input. Profiles loaded into the tool are converted to JSON, manipulated in JavaScript then converted back to XML. 

## Dependencies
* Node v15.2.0 or greater

## Installation
* git clone https://github.com/AtriumAI/profile_utility
* cd profile_utility
* npm install

## How to use

* cd into the root directory of the application
* npm run start -- --csv path/to/csv --dir path/to/valid/profiles/folder

The --csv and --dir flags are required, the tool will not work without those arguments
