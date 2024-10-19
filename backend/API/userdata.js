const express = require('express');
const router = express.Router();
const db = require('../index.js');


router.post('/create' , async(req , res) => {
    const header = req.header;
    const body = req.body;
    
    res.send({body});
});

module.exports = router;