const express = require("express");
const app = express();
const {
    getImages,
    addImageData,
    getImageData,
    addCommentsData,
    getCommentsData,
    getMoreImages
} = require("./utils/db");
const s3 = require("./utils/s3");
const config = require("./utils/config");

///////////// FILE UPLOAD BOILERPLATE ///////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

app.use(express.json());

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
            res.json(result);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.get("/images/:lowestId", (req, res) => {
    getMoreImages(req.params.lowestId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = config.s3Url + filename;
    const { title, username, description } = req.body;
    addImageData(url, username, title, description)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.get("/currentImage/:id", (req, res) => {
    getImageData(req.params.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.post("/comments/:id", (req, res) => {
    addCommentsData(req.body.comment, req.body.username, req.params.id)
        .then(comment => {
            res.json(comment);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.get("/comments/:id", (req, res) => {
    getCommentsData(req.params.id)
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            console.log("ERROR :", err);
        });
});

app.listen(8080, () => console.log("My image board server is UP!"));
