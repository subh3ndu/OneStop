const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

// set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const homeStartingContent =
    'One stop is a one stop solution for all your needs';

const aboutContent =
    'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';

const contactContent =
    'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const posts = [];
mongoose.connect(
    'mongodb+srv://subhendu:1234@cluster0.icnsawk.mongodb.net/test',
    { useNewUrlParser: true }
);

const postSchema = {
    title: String,
    body: String,
    datentime: String,
    link: String,
};

const Post = mongoose.model('post', postSchema);

// it will render landing.ejs
app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/about', function (req, res) {
    res.render('about', {
        aboutContent: aboutContent,
    });
});

app.get('/contact', function (req, res) {
    res.render('contact', {
        contactContent: contactContent,
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/posts', function (req, res) {
    Post.find({}, function (err, foundPosts) {
        res.render('home', {
            startingContent: homeStartingContent,
            allPosts: foundPosts,
        });
    });
});

app.get('/compose', function (req, res) {
    res.render('compose');
});

app.get('/posts/:postId', function (req, res) {
    const reqstTitle = req.params.postId;

    Post.findById(reqstTitle, function (err, foundPost) {
        if (!err) {
            res.render('post', {
                title: foundPost.title,
                body: foundPost.body,
                datentime: foundPost.datentime,
                link: foundPost.link,
            });
        }
    });
});

app.delete('/posts/:postId', function (req, res) {
    const reqstTitle = req.params.postId;

    Post.deleteOne({ _id: reqstTitle }, function (err) {
        if (!err) {
            res.send('Deleted Successfully');
        }
    });
});

app.post('/compose', function (req, res) {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody,
        datentime: req.body.postDate,
        link: req.body.postLink,
    });

    post.save(function (err) {
        if (!err) {
            res.redirect('/posts');
        }
    });
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    res.redirect('/posts');
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
