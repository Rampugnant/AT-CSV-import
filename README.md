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
