const express = require("express");
const app = express();
const { getImages } = require("./utils/db");

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

// app.get("/planets", (req, res) => {
//     let planets = [
//         {
//             name: "Pluto",
//             color: "grey/yellow"
//         },
//         {
//             name: "Venus",
//             color: "orange"
//         },
//         {
//             name: "Mars",
//             color: "red"
//         }
//     ];
//     console.log("i hit the planets route");
//     res.json(planets);
// });

// {
//     "images" : [
//         {
//             "name" : "bla",
//             "url" : "example.com"
//         }
//     ]
// }

app.get("/images", (req, res) => {
    getImages()
        .then(result => {
            console.log("Result is: ", result);
            res.json({
                images: result
            });
        })
        .catch(err => {
            console.log("ERR", err);
        });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    // req.file - the file that was just uploaded
    // req.body - refers to the values we type in the input fiels
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("My image board server is UP!"));
