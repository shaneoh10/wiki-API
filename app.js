const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI);

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);

//TODO

app.listen(3000, () => {
  console.log("Server started on port 3000");
});