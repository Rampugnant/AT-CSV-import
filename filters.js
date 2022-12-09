/* 
    This file allows you to set up the filters and to edit the 
    parsed data to result in ready to go record.

*/

function testandclean(obj) {

    let reject = 0

    // cleans
    if(obj.articleNum || obj.articleNum >= 0){ obj.articleNum += ""; }
    if(obj.birthDate){ obj.birthDate = new Date(obj.birthDate); }
    if(obj.lastname){ obj.id = obj.lastname + obj.articleNum; }

    // filters - tests records to make sure we want them 
    if(!obj.birthDate){ reject++; }
    if(obj.lastname === null){ reject++; }

    // finally, mark as rejected
    if(reject >= 1) {obj.reject = true;}
    
}




module.exports = { testandclean };