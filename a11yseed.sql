-- seed user password to experiment with is "alligator"


DROP DATABASE a11y;

CREATE DATABASE a11y;
\connect a11y;

CREATE TABLE users(
    username TEXT NOT NULL,
    password TEXT NOT NULL

);

INSERT INTO users(username, password)
VALUES ('testuserKate',
'$2a$10$ktsFhrylH3ngy5j.hrEopu1qYI67WzqjH4CYHEcfdOorRTx9i48Ta'),
('testuserJane',
'$2a$10$ktsFhrylH3ngy5j.hrEopu1qYI67WzqjH4CYHEcfdOorRTx9i48Ta'),
('testuserJack',
'$2a$10$ktsFhrylH3ngy5j.hrEopu1qYI67WzqjH4CYHEcfdOorRTx9i48Ta');


-- command to run from cli: psql -d a11y -a -f a11yseed.sql