const express = require('express')
const {connectToDb,getDb}= require('./db')
const { ObjectId } = require('mongodb')

//init app and middleware
const app = express()
app.use(express.json())

//db connection
let db

connectToDb((err) => {
    if(!err){
        app.listen(7000, () => {
            console.log('app listening in port 7000')
        })
        db=getDb();
    }
})


//routes
  // get all doc in database
app.get('/books', (req, res) => {
    // current page (pagination)
    const page=req.query.p||0;
    //  books per Page
    const booksPerPage=3

  let books=[]

    db.collection('books')       
    .find()
    .sort({author : 1})
    .skip(page*booksPerPage)   //pagiantion
     .limit(booksPerPage)
    .forEach(book=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    }).catch(()=>{
        res.status(500).json({error:'could not fetch the doc'})
    })

    // res.json({mssg:"welcome to the api"})
})

// get a particulat doc by id from database
 app.get('/books/:id', (req, res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({error:'couls not ftch doc'})
        })
    }else{
        res.status(500).json({error: "not valid id"})
    }
    
 })
    //insert new doc in database
 app.post('/books',(req,res)=>{
    const book = req.body

    db.collection('books') 
    .insertOne(book)
    .then(result=>{
        res.status(201).json(result)
    }).catch(err=>{res.status(500).json({err:'could not create a new document'})})


 })
 
   //del doc in databse
 app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({error:'could not del the doc'})
        })
    }else{
        res.status(500).json({error: "not valid id"})
    }
    
 })

 //update document in database

 app.patch('books/:id',(req,res)=>{
    const updates= req.body
    //  {"title"}
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)},{$set:updates})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{ 
            res.status(500).json({error:'could not update the doc'})
        })
    }else{
        res.status(500).json({error: "not valid id"})
    }
    

 })
         
 //pagination
  





