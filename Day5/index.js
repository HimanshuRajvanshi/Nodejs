var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var csv = require('csvtojson');
var bodyParser = require('body-parser');
var userModel = require('./models/user');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


var uploads = multer({ storage: storage });

//connect to db  
mongoose.connect('mongodb://localhost:27017/csvdemos', { useNewUrlParser: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))


//init app  
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//static folder  
app.use(express.static(path.resolve(__dirname, 'public')));

//default pageload  
app.get('/user_data', (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                res.json({ data: data });
            } else {
                res.json({ data: '' });
            }
        }
    });
});


var temp;

app.post('/save_user', uploads.single('csv'), (req, res) => {
    //convert csvfile to jsonArray     
    // console.log("Hit on save user");
    csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            console.log(jsonObj);
            // for (var x = 0; x < jsonObj; x++) {
            //     temp = parseFloat(jsonObj[x].Test1)
            //     jsonObj[x].Test1 = temp;
            //     temp = parseFloat(jsonObj[x].Test2)
            //     jsonObj[x].Test2 = temp;
            //     temp = parseFloat(jsonObj[x].Test3)
            //     jsonObj[x].Test3 = temp;
            //     temp = parseFloat(jsonObj[x].Test4)
            //     jsonObj[x].Test4 = temp;
            //     temp = parseFloat(jsonObj[x].Final)
            //     jsonObj[x].Final = temp;
            // }
            userModel.insertMany(jsonObj, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/user_data');
                }
            });
        });
});



//assign port  
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Boom Server is runing' + port));