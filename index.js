const express = require("express");
const app = express();
const { getImages, addImageData, getImageData } = require("./utils/db");
const s3 = require("./s3");
const config = require("./config");

///////////// FILE UPLOAD BOILERPLATE ///////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
///////////// FILE UPLOAD BOILERPLATE ///////////

app.use(express.static("public"));

app.get("/images", (req, res) => {
    getImages()
        .then(result => {
            console.log("Result is: ", result);
            res.json(result);
        })
        .catch(err => {
            console.log("ERR", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // req.file - the file that was just uploaded
    // req.body - refers to the values we type in the input fiels
    const { filename } = req.file;
    const url = config.s3Url + filename; //if you got here you have url of img and all other information
    console.log("URL :", url);
    const { title, username, description } = req.body; // you gotta put this information in database, you will do data base query INSERT : title, username, description, url. Send that back into response

    addImageData(url, username, title, description)
        .then(result => {
            console.log("result :", result);
            res.json(result);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
    // if (req.file) {
    //     res.json({
    //         success: true
    //     });
    // } else {
    //     res.json({
    //         success: false
    //     });
    // }
});

app.get("/currentImage/:id", (req, res) => {
    let id = req.params.id;
    console.log("req.params.id: ", id);

    getImageData(req.params.id).then(result => {
        console.log("result: ", result);
        res.json(result);
    });
});

// after amazon is complete you should put your images. Because if amazon fales you have no image!
//you should UNSHIFT image not push it. It's then infront of your images array

// {
//     image: 'https://whatever.com/fun.jpg',
//     title: "",
//     id: 11
// }

app.listen(8080, () => console.log("My image board server is UP!"));
