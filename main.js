const fs = require ('fs');
const util = require ('util');
const papa = require ('papaparse');
const filter = require ('./filters');



function parseFile(){
    // Read in file and parse in the call back
    const readFile = util.promisify(fs.readFile);

    let fileRecs;
    const customPromise = new Promise(function(resolve, reject){
        readFile('./test.csv', 'utf-8')
            .then(function(data){
                let res;
                papa.parse(data, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        for (let i = 0; i < results.data.length; i++){
                            // casts types and marks recs based on filters
                            filter.testandclean(results.data[i]);
            
                            if (results.data[i].reject){
                                results.data.splice(i, 1);
                            }
                        }
                        res = results.data;
                    }
                })
                return  res  
            })
            
            .then(function (recs){
                resolve(recs);
            })
            
                
            .catch(function (err){ reject(new Error, err);})
        ;
    })

    return customPromise;
    
}



function comparison (fileRecs, atRecs) {
    
    let updateArray = [];
    let createArray = [];

    for (rec of fileRecs) {
        let updateCheck = 0;
        
        for (atrec of atRecs) {

            // Check if rec from file matches airtable rec (atrec)
            if(rec.id === atrec.fields.id){
                // increase updateCheck to show that this record does not
                // need to be created.
                updateCheck++;
                
                // iterate through fields and compare
                for (field of Object.keys(rec)){
                    // if the field values don't match
                    
                    // account for Dates, which can't be compared as easily
                    if (rec[field] instanceof Date){
                        if (!rec[field].getTime() === atrec.fields[field].getTime()){
                            updateArray.push({
                            "id" : atrec.id,
                            "fields" : rec
                        });
                        break;
                        }
                    // compare everything else
                    } else if (!(rec[field] === atrec.fields[field])){
                        updateArray.push({
                            "id" : atrec.id,
                            "fields" : rec
                        });
                        break;
                    }
                }
                break;
            }
            
        }

        // check to see if rec was updated - if not, add to create array
        if (updateCheck === 0) {
            createArray.push({fields : {...rec}});
        }
        
    }

    return ([createArray, updateArray])
    // return both arrays

}

module.exports = { comparison, parseFile };


/*
    ingest file
    parse ingest
    transform results
    filter results

    call Airtable
    get records
    push fields to array

    !!! Once both previous processes are done

    Iterate through results
    iterate through array
    match current result to array item (if exists)
        check fields to see if it needs updating
            push current result to update array
    not matched current result
        push current result to create array
    
    As each array gets to 10
        call update and create


*/