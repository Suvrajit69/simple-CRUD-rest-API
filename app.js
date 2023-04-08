const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName: "wikiDB"})
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e))

const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model("Article", articleSchema);//This is Database collection
// Request targeting all articles
app.route('/articles')
  .get((req, res) => {
    Article.find()
   .then((f)=>{res.send(f)})
   .catch((err)=>{res.send(err)})
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
   newArticle.save()
   .then(()=>{res.send("newArticle inserted")})
   .catch((err)=>{res.send(err)})
  })

  .delete(()=>{
    Article.deleteMany()
    .then(()=>{res.send("Sucessfuly deleted all articles")})
    .catch((err)=>{res.send(err)})  
  });

// Request targeting a specific articles

app.route("/articles/:articleTitle")
.get((req, res) => {
    console.log(req.params.articleTitle)
    Article.findOne({title: req.params.articleTitle})
    .then((f)=>{
      if(f){
        res.send(f)
      }else{
        console.log("No articles found")
      }
    })
    .catch(()=>{res.send("no articles found")})
  })
  .put((req, res)=>{
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content})
      // {overwrite: true})
      .then(()=>{res.send('Sucessfuly updated')})
      .catch((err)=>{res.send(err)})
  })
  .patch((req,res)=>{
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body}
   )
    .then(()=>{res.send("patch updated")}).catch((err)=>{res.send(err)})
  })
  .delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle})
    .then(()=>{res.send("sucessfuly deleted a article")})
    .catch((err)=>{res.send(err)})
  })
  
app.listen(3000, function() {
  console.log("Server started on port 3000");
});