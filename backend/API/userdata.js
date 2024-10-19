const express = require('express');
const router = express.Router();
const db = require('../index.js');

router.post('/create' , async(req , res) => {
     const header = req.header;
     console.log("aaa");
     res.send({});
});

module.exports = router;