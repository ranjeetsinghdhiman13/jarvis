# Jarvis Coding Test Part I

# Design / Architecture
I have chose MongoDB as database. Rest of the code is basic API of nodeJS

# Tech-Stack Used to build application:

1. NodeJS
2. MongoDB

# Application Assumptions
Regarding (**Total number of bets sold per hour**) rest endpoint, requirement was not clear. So I have assumed that I will pass fromDate and toDate as request parameters to limit the number of records return in the response.

# How to run this application
* Install NodeJS if note already installed. The official Node.js website has installation instructions for Node.js: https://nodejs.org
* Install MongoDB from - https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.4-signed.msi
* Install MongoDB library using npm

``` npm install mongoDB ```
* Clone the git repo using following command

```git clone https://github.com/ranjeetsinghdhiman13/jarvis.git```
	
   This will create a folder jarvis in your current working directory.
* Execute command:

``` cd jarvis ```
* Run the following command to create test data

```node mongoCreate.js```

# Testing


## Author
* **Ranjeet Singh**
