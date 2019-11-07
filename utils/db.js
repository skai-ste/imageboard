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
            `SELECT id, url, username, title, description FROM images ORDER BY created_at DESC LIMIT 12`
        )
        .then(({ rows }) => {
            return rows;
        });
};
exports.getMoreImages = function(lowestId) {
    return db
        .query(
            `SELECT id, url, username, title, description, (
                    SELECT id
                    FROM images
                    ORDER BY id ASC
                    LIMIT 1
            ) AS "lowestId"
            FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 12`,
            [lowestId]
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
            `SELECT id, url, username, title, description, created_at, (
                    SELECT id
                    FROM images
                    WHERE id > $1
                    ORDER BY id DESC
                    LIMIT 1
            ) AS "prevId", (
                    SELECT id
                    FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 1
            ) AS "nextId"
            FROM images
            WHERE id = $1`,
            [id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
exports.addCommentsData = function(comment, username, user_id) {
    return db
        .query(
            `INSERT INTO comments (comment, username, user_id) VALUES ($1, $2, $3) RETURNING *`,
            [comment, username, user_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
exports.getCommentsData = function(user_id) {
    return db
        .query(
            `SELECT comment, username, created_at FROM comments WHERE user_id = $1`,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
