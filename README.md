# AWS-file-backup-and-restore
This is a simple web-based application for file backup and restore, to be hosted on an AWS EC2 instance. This application serves the purpose of backing up data and files on the cloud i.e AWS S3 bucket and restoring them when required.

# Tools Used
-> AWS EC2  
-> AWS S3  \
-> node.js for backend  
-> HTML and CSS for frontend

# Steps to run the application
-> Set up an EC2 instance  
-> Set up an S3 bucket  
-> On your local system connect to the EC2 instance using SSH  
-> Go to the project directory and make sure the files are in the following structure:  
/FileBackup  
----app.js  
----/public  
--------index.html  
--------style.css  
-> Run the command "node app.js"
