
// First, let's import the mongoclient. Make sure to run "npm i mongodb" in this folder first.
const { MongoClient, ObjectId } = require('mongodb'); 
// Please enter the password your instructor shared with you:
const userName = process.env.MongoDbUserName; // Please enter your username here.
const password =  process.env.password;  // Please enter your password here.

// Dear INSTRUCTOR, please adjust this to your own cluster's connection string (the part after the @):
const connectionString = "virendraop7.nkvyxlo.mongodb.net"

// There's no need to change username and database:
const database = `workspace`; // this is the database you'll be connecting to.

const uri = `mongodb+srv://${userName}:${password}@${connectionString}`

const client = new MongoClient(uri);

// CREATE
async function createOperation(collection,newObject){
  
    const response = await client
    .db(database)           // our database
    .collection(collection)   // the collection for the createOperation function is "create".
    .insertOne(newObject);           // this method needs an object as an argument. Which object goes here?
    console.log("response");
    verifyIfDocumentWasCreated(response, newObject);
}


// UPDATE
async function updateOperation(collection,newObject,filter) {
    // This is the unique id of the document we will update. Get the id from the READ results.

    // Fix the following syntax:
    const response = await client
    .db(database)   // our database
    .collection(collection)                    // the UPDATE operation should access the collection "update"
    .updateOne({ filter}, newObject) // updateOne receives two parameters: First is the search query object (what we are looking for), and the second is the update query OBJECT, which contains the data we want to change.

    verifyIfDocumentWasUpdated(response, id); // this logs the results to console. Don't worry about this function.
}

// DELETE -- DO NOT DELETE FROM THE READ COLLECTION, no matter what!
async function deleteOperation(collection,filter) {
    const response = await client
    .db(database)
    .collection(collection)             // The DELETE operation should use the "delete" collection.
    .deleteOne({filter})  // this only needs a search {key: value} pair that matches what we want to delete. What do the instructions from "read" tell you?

    console.log(`${project} deleted ${response.deletedCount} document(s).` )
}


// Optional quality-of-life functions:

function verifyIfDocumentWasUpdated(response, id) {
    // Ensure document was found and updated. This is for logging to console only. Don't worry about this if else block.
    if (response.matchedCount === 0) {
        console.log(`No document found with _id: ${id}.`);
    } else if (response.modifiedCount === 0) {
        console.log(`Document _id: ${id} was found but not updated (same data).`);
    } else {
        console.log(`${project} successfully updated document _id: ${id}.`);
    }
}

function verifyIfDocumentWasCreated(response, project) {
    if (response.insertedId) {
        console.log(`${project} inserted document: _id: ${response.insertedId}`);
    } else {
        console.log("Document insertion failed.");
    }
}