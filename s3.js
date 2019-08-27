const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.send(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read", //everyone who has url of the img can read it
            Key: filename,
            Body: fs.createReadStream(path), // The path is available as a property of req.file
            ContentType: mimetype,
            ContentLength: size // You can use the size property of req.file for this
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            next();
            //that means the file is at amazon, and if it there the url is s2/wwwmaazon.com/name of your bucket/maybeimgname
            fs.unlink(path, () => {}); //when it get too many files
        })
        .catch(err => {
            // uh oh
            console.log(err);
            res.sendStatus(500);
        });
};
