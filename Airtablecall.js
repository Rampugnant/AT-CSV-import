const Airtable = require('airtable');
const {apiKey} = require('./config');
const main = require('./main');

// Define Airtable Base specifics
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: apiKey
});

const base = Airtable.base('appgoaq9qwhJDXgtb');
const source = 'Table 1';
const view = "UPDATE";

// Global var for file recs - this is bad



function getATRecords() {
    
    let sourceRecordsMatch = [];

    base(source).select({
        view: view
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            // test to make sure the record isn't empty, and if not add to return array
            if (record._rawJson.fields.id) { 
                // be sure to translate any dates into JS Date objects
                record._rawJson.fields.birthDate = new Date (record._rawJson.fields.birthDate);
                sourceRecordsMatch.push(record._rawJson); 
            }
        })
        fetchNextPage();
    }, function done(err) {
        if (err) {console.log(err); return}
        
        main.parseFile()
        .then(function(data){
            return main.comparison(data, sourceRecordsMatch);
        })
        .then(function(arrs){
            createAndUpdate(arrs[0], arrs[1]);
        })

        // Work on making create and update calls

        .catch(function(err){ console.log(err);})
        

    })
    
}

function createAndUpdate (create, update) {
    if (create.length !== 0) {
        // send create array to be paced and passed to create method.
        // buildByTen(create, source, createAllRecords)
        console.log("Create this many records: " + create.length);
    }
    if (update.length !== 0) {
        // send update array to be paced and passed to update method.
        // buildByTen(update, source, updateAllRecords)
        console.log("Update this many records: " + update.length);

    }

}

getATRecords();
