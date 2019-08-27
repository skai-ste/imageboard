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
        .query(`SELECT url, username, title, description FROM images`)
        .then(({ rows }) => {
            return rows;
        });
};
