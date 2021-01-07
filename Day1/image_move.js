const fs = require("fs");
const path = require("path")
const directory_name = "/home/jc/Pictures";
const folder_name = '/home/jc/Desktop/image_backup';


fs.mkdir(folder_name, function (err) {
    if (err) {
        // console.log(err)
        console.log("Directory already Exit")
    } else {
        console.log("New directory successfully created.")
    }
});


const filenames = fs.readdirSync(directory_name);
// console.log(filenames);
filenames.forEach((file) => {
    const filetype = path.extname(file)
    // console.log(filetype);
    if (filetype == '.png') {
        const pathToFile = path.join(directory_name, file);
        const pathToNewDestination = path.join(folder_name, file)
        try {
            fs.copyFileSync(pathToFile, pathToNewDestination)
        } catch (err) {
            throw err
        }
        console.log("Successfully copied and moved the file!")
    } else {
        console.log("This File can not move", file)
    }

});