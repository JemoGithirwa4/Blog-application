import express from "express";
import bodyParser  from "body-parser";
import _ from 'lodash';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res) => {
    res.render("home.ejs", { posts: posts });
});

app.get("/posts", (req, res) => {
    res.render("posts.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.post("/posts", (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };

    posts.push(post);

    res.redirect("/")
})

app.get("/posts/:postName", (req, res) => {
    const reqTitle = _.lowerCase(req.params.postName);

    posts.forEach(post => {
        const storedTitle = _.lowerCase(post.title);
        if (storedTitle === reqTitle) {
            res.render("post.ejs", {
                title: post.title,
                content: post.content
            })
        }
    })
})

app.post("/delete", (req, res) => {
    const postTitle = req.body.postTitle;

    posts = posts.filter((post) => post.title !== postTitle);

    res.redirect("/");
});

app.get("/edit/:postTitle", (req, res) => {
    const postTitle = req.params.postTitle;

    // Find the post to edit
    const post = posts.find((p) => p.title === postTitle);

    if (post) {
        res.render("edit.ejs", { post: post });
    } else {
        res.redirect("/"); // If not found, redirect to home
    }
});

app.post("/edit", (req, res) => {
    const oldTitle = req.body.oldTitle;
    const newTitle = req.body.newTitle;
    const newContent = req.body.newContent;

    // Find and update the post
    posts.forEach((post) => {
        if (post.title === oldTitle) {
            post.title = newTitle;
            post.content = newContent;
        }
    });

    res.redirect("/"); // Redirect to home page
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})