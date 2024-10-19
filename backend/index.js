const express = require('express');
const app = express();

const admin = require('firebase-admin');
const ServeceAccount = require('./ServiceAccount.json');
const cors = require('cors');

app.use(cors());

admin.initializeApp({credential:admin.credential.cert(ServeceAccount)});

const db = admin.firestore();

const fireInit = new Promise((res , rej) => {
    admin.firestore().settings({
        timestampInSnapshots: true,
    });
    res();
});

fireInit.then(() => {
    //api
    app.use('/api/user' , require('./API/userdata.js'));
    app.listen(3000);
});

module.exports = db;