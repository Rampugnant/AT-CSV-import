# AT-CSV-import

Current workflow requires colocated files on a server. Files are updated external of script. Script is called external of script. 

Script ingests colocated file, calls current working view of records in specified table and ingests records, compares file records with existing records, creates update array of records to update and create array of records to create, passes arrays to API calls through pacing functions to not overcall within AT specifications.

## To do
[ ] Make test csv data using multiple data types
[ ] Mirror in AT base and include a few AT only fields
[ ] Increase documentation to help others establish data feeds

- explore:
    - custom class for records with constructor method
    - modularizing current functions to make more generic and maintainable
    - Is papaparse the best parser to use here and how else could we parse and ensure clean data?
    - Passing by reference to speed up performance

- Back burner / bells and whistles
    - explore standalone application to contain the whole process


## Filters.js

After the file is read in it is parsed by papaparser. The results aren't always great depending on how the data was formatted in the first place. Also, based on the data types needed in Airtable, sometimes things need to be cast into a different type in order to work with the field type. This all happens in the function testandclean in this file. 

Cleans happen first. Always test to make sure there is a value currently there with an if statement. Then update the value to the necessary type. Then the filters go through and check to see if the record fits the data structure. They mark the record as a reject if it fails. Customize the function testandclean to suit your data.
