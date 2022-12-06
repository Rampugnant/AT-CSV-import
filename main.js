const fs = require ('fs');
const papa = require ('papaparse');
const filter = require ('./filters');

function main () {
    let dataobject = [];
    // Read in file and parse in the call back
    fs.readFile('./test.csv', 'utf-8', function(err, data) {
        papa.parse(data, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                // Add filters here to isolate clean data (if not done already)
                // Add data casts here as needed

                // can I have all of this in a func since it will be very specific to use - it could return the dataobject, although it would be ideal to actually just edit the results.data
                
                for (let i = 0; i < results.data.length; i++){
                    filter.testandclean(results.data[i]);

                    if (results.data[i].reject){
                        results.data.splice(i, 1);
                    }
                }

            }
        })

    } )


}

main();