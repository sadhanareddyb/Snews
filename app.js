//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt= require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};
const userSchema = new mongoose.Schema({
  email: {type : String , unique: true},
  password: {type : String},
  
});
 

const secret="Thisissecret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});


const User = new mongoose.model("User", userSchema);

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("register");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password,
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("compose");
    }
  
});
});
app.get("/corona", function(req, res){
  res.redirect("https://www.indiatoday.in/coronavirus");
});
app.get("/Livetv", function(req, res){
  res.redirect("https://www.indiatoday.in/livetv");
});


app.get("/login", function(req, res){
  res.render("login");
});


app.post("/login", function(req, res){

 
    username= req.body.username;
    password= req.body.password;
  
User.findOne({email:username},function(err,foundUser){

  if (err) {
    return res.status(422).send({error:"please enter all fields"})
  } else {
    if(foundUser){
      if(foundUser.password===password){
        res.redirect('/');
      }
    }
  }

});
});

app.get("/edit/:id", (req, res) => {
  const requestedId = req.params.id;
  console.log(req.body);
  Post.findOne({
    _id: requestedId
  }, (err, post) => {
    if (!err) {
      res.render("edit", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.post("/delete", (req, res) => {
  const deletePost = req.body.delete;

  Post.findByIdAndDelete(deletePost, (err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
