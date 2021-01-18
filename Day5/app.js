var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var csvModel = require('./models/csv');
var csv = require('csvtojson');
var bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



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


//set the template engine  
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    csvModel.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                res.render('demo', { data: data });
            } else {
                res.render('demo', { data: '' });
            }
        }
    });
});


app.get('/get_csv', (req, res) => {
    csvModel.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                // res.json({ data: data });
                data.forEach(element => {
                    // res.json(element.LastName);
                    const data = [{
                        id: element.id,
                        LastName: element.LastName,
                        FirstName: element.FirstName,
                        SSN: element.SSN
                    }];
                });
                const csvWriter = createCsvWriter({
                    path: 'out.csv',
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'LastName', title: 'LastName' },
                        { id: 'FirstName', title: 'FirstName' },
                        { id: 'SSN', title: 'SSN' },
                    ]
                });



                csvWriter
                    .writeRecords(data)
                    .then(() => console.log('The CSV file was written successfully'));


            } else {
                res.json({ data: '' });
            }
        }
    });

    // // console.log("Hello get_csv");
    // const csvWriter = createCsvWriter({
    //     path: 'out.csv',
    //     header: [
    //         { id: 'id', title: 'id' },
    //         { id: 'LastName', title: 'LastName' },
    //         { id: 'FirstName', title: 'FirstName' },
    //         { id: 'SSN', title: 'SSN' },
    //     ]
    // });



    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));


});


var temp;
app.post('/', uploads.single('csv'), (req, res) => {
    //convert csvfile to jsonArray     
    csv()
        .fromFile(req.file.path)
        .then((jsonObj) => {
            // console.log(jsonObj);
            csvModel.insertMany(jsonObj, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        });
});



//assign port  
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('server run at port ' + port));