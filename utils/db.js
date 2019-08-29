const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/imageboard`);
}

exports.getImages = function() {
    return db
        .query(
            `SELECT id, url, username, title, description FROM images ORDER BY created_at DESC`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addImageData = function(url, username, title, description) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [url, username, title, description]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.getImageData = function(id) {
    return db
        .query(
            `SELECT id, url, username, title, description, created_at FROM images WHERE id = $1`,
            [id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.addCommentsData = function(id, comment, username) {
    return db
        .query(
            `INSERT INTO comments (id, comment, username) VALUES ($1, $2, $3) RETURNING *`,
            [id, comment, username]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

// SELECT * FROM images
// WHERE id < $1
// ORDER BY id DESC
// LIMIT 20
//
// // infinite scrool is better choice as with more button you need to fugure out how many pictures and ect
//
// SELECT id AS "lowestId"
// FROM images
// ORDER BY id ASC
// LIMIT 1
// // you can do seperate query or this bellow
// // SELECT images.id, images.title (
// SELECT *, (
//     SELECT id
//     FROM images
//     ORDER BY id ASC
//     LIMIT 1
// ) as "lowestId" FROM images
// WHERE id < $1
// ORDER BY id DESC
// LIMIT 20

// IF THERE IS NEXT IMG SHOW LEFT ARROW / EIGHT ARROW
