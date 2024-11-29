const express = require('express');
const app = express();

const admin = require('firebase-admin');
const ServeceAccount = require('./ServiceAccount.json');
const cors = require('cors');

app.use(cors());
app.use(express.json());

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
    app.use('/api/user' , require('./API/userData.js'));
    app.use('/api/print' , require('./API/printManage.js'));
    app.listen(4545);
});

module.exports = db;