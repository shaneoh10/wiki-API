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

// ----------------------------- DATABASE SETUP & SCHEMA  

mongoose.connect(process.env.MONGODB_URI);

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);

// ----------------------------- ROUTES

// ALL ARTICLES 

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
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
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

// SPECIFIC ARTICLE 

app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send('No article matching that title found.')
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: {title: req.body.title, content: req.body.content} },
            { overwrite: true },
            (err) => {
                if (!err) {
                    res.send('Successfully updated article');
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if(!err) {
                    res.send('Successfully updated article');
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send('Successfully deleted article');
                } else {
                    res.send(err);
                }
            }
        );
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});