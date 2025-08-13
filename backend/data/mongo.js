
// First, let's import the mongoclient. Make sure to run "npm i mongodb" in this folder first.
const { MongoClient } = require('mongodb'); 
// Please enter the password your instructor shared with you:
const userName = process.env.MongoDbUserName; // Please enter your username here.
const password =  process.env.password;  // Please enter your password here.

// Dear INSTRUCTOR, please adjust this to your own cluster's connection string (the part after the @):
const connectionString = "virendraop7.nkvyxlo.mongodb.net"

// There's no need to change username and database:
const database = `workspace`; // this is the database you'll be connecting to.

const uri = `mongodb+srv://${userName}:${password}@${connectionString}`

const client = new MongoClient(uri);

// READ
async function readMongo(collection, filter = {}) {
  try {        
    const response = await client
      .db(database)            // select the database
      .collection(collection)  // select the collection
      .find(filter)             // apply the filter (empty object means "all documents")
      .toArray();               // convert cursor to array
      

    return response;
  } catch (err) {
    console.error("Error reading from MongoDB:", err);
    throw err;
  }
}

// CREATE
async function createMongo(collection,newObject){
  
    const response = await client
    .db(database)           // our database
    .collection(collection)   // the collection for the createOperation function is "create".
    .insertOne(newObject);           // this method needs an object as an argument. Which object goes here?    
    
}


// UPDATE
async function updateMongo(collection,newObject,filter) {
    // This is the unique id of the document we will update. Get the id from the READ results.

    // Fix the following syntax:
    const response = await client
    .db(database)   // our database
    .collection(collection)                    // the UPDATE operation should access the collection "update"
    .updateOne(filter, newObject) // updateOne receives two parameters: First is the search query object (what we are looking for), and the second is the update query OBJECT, which contains the data we want to change.
    
}

// DELETE -- DO NOT DELETE FROM THE READ COLLECTION, no matter what!
async function deleteMongo(collection,filter) {
    console.log(collection, filter);
    const response = await client
    .db(database)
    .collection(collection)             // The DELETE operation should use the "delete" collection.
    .deleteOne(filter)  // this only needs a search {key: value} pair that matches what we want to delete. What do the instructions from "read" tell you?

    console.log(`${filter} deleted ${response.deletedCount} document(s).` )    
}

module.exports = {
    readMongo,
    createMongo,
    updateMongo,
    deleteMongo
};