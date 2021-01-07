const express = require('express');
const multer = require('multer');
//For Save into Folder
const upload = multer({dest: __dirname + '/uploads/images'});
var mongoose = require('mongoose');
var ImageUpload = require('./models/ImageUpload.js');

var bodyParser = require('body-parser');


const app = express();
const PORT = 3000;
// app.use(express.static('public'));


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
    ImageUpload.find({}, (err, items) => {
        if (err) {
            console.log("Error" +err);
        }
        else {
            // console.log("Success"+ items);
            // res.render('app', { items: items });
            res.render('index.html',{ items: items });
        }
    });


    
});


app.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        console.log("Image Uploaded");
        var obj = {
            name: "Himanshu",
            image_url: req.file.filename,
            // img: {
            //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            //     contentType: 'image/png'
            // }
        }

        
        // var ImageUpload = new ImageUpload({
        //     name: "Himanshu",
        //     image_url: req.file.filename,
        //   });


        ImageUpload.create(obj, (err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                // item.save();
                console.log("Boom Image saved");
                res.redirect('/');
            }
        });


        res.json(req.file);
    }
    else throw 'error';
});


//For check Route is Define or not
app.get('*', function (req, res) { 
    res.render('error.html');
}) 
  


app.listen(PORT, () => {
    console.log('The Listening at ' + PORT );
});