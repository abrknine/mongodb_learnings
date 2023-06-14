const {MongoClient} = require('mongodb')


let dbConnection
 //import both function like  this;
module.exports={
    //funtion to connect to database
    connectToDb :(cb)=>{
        MongoClient.connect('mongodb://localhost:27017/bookstore')
        .then((client)=>{
            dbConnection=client.db()
            return cb();
        }).catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    //function to get access of database
    getDb:()=>dbConnection
}