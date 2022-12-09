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


// This is the first function called
function getATRecords() {
    
    let sourceRecordsMatch = [];

    // using Airtable's API, get records
    base(source).select({
        view: view
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            // test to make sure the record isn't empty
            if (record._rawJson.fields.id) { 
                // be sure to translate any dates into JS Date objects
                record._rawJson.fields.birthDate = new Date (record._rawJson.fields.birthDate);
                // add the record to the return array
                sourceRecordsMatch.push(record._rawJson); 
            }
        })
        fetchNextPage();
    }, function done(err) {
        if (err) {console.log(err); return}
        // Once everything above is done, parse the collocated data file
        main.parseFile()
        .then(function(data){
        // Once parsed, compare both sets of records
            return main.comparison(data, sourceRecordsMatch);
        })
        .then(function(arrs){
            // the comparison above results in an array of 2 arrays
            // [0] is the records to create array 
            // [1] is the records to update array
            if (arrs[0].length !== 0) {
                // send create array to be paced and passed to create method.
                main.buildByTen(arrs[0], source, createAllRecords)
                console.log("Create this many records: " + arrs[0].length);
            }
            if (arrs[1].length !== 0) {
                // send update array to be paced and passed to update method.
                main.buildByTen(arrs[1], source, updateAllRecords)
                console.log("Update this many records: " + arrs[1].length);
        
            }
        })


        .catch(function(err){ console.log(err);})
        

    })
    
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 

async function updateAllRecords (update, table) {
    await sleep(500);
    base(table).update(update, 
        {typecast: true}, function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
    });
}

async function createAllRecords (create, table) {
    await sleep(500);
    base(table).create(create,
        {typecast: true}, function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
    });
}

getATRecords();
