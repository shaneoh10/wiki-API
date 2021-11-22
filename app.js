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

// ----------------------------- ROUTES

app.get('/articles', (req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added new article!");
        } else {
            res.send(err);
        }
    });
});

app.delete('/articles', (req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});