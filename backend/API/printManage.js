const express = require('express');
const router = express.Router();
const db = require('../index.js');

router.post('/create' , async (req, res) => {
    const query = req.query;
    const id = query.id;
    const printData = {
        title:query.title,
        date:query.date,
        exp:query.exp,
    }
});