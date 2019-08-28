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
