DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(299) NOT NULL,
    username VARCHAR(199) NOT NULL,
    title VARCHAR(199) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL CHECK (comment != ''),
    username VARCHAR(199) NOT NULL CHECK (username != ''),
    user_id INTEGER REFERENCES images(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
