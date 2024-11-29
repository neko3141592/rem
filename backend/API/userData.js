const express = require('express');
const router = express.Router();
const db = require('../index.js');

router.get('/create' , async(req , res) => {
    const query = req.query;
    const userData = await searchUser(query);

    if(userData.status === 'found') {
        res.send(searchUser(query));
    } else if (userData.status === 'not found') {
        if(await createUser(query)) {
            res.status(200).send({status:'success'});
        } else {
            res.status(500).send({status:'error'});
        }
    } else {
        res.status(500).send({status:'error'});
    }
});

const searchUser = async (query) => {
    const searchData = {
        email: query.email
    };
    try {
        const snapshot = await db.collection('users')
            .where('email', '==', searchData.email)
            .get();

        let users = []; 
        snapshot.forEach(doc => {
            users.push({
                id: doc.id, 
                ...doc.data() 
            });
        });

        if (users.length > 0) {
            return { status: 'found', data: users };
        } else {
            return { status: 'not found' };
        }
    } catch (error) {
        console.error(error);
        return { status: 'error', message: error.message };
    }
};

const createUser = async (query) => {
    const addData = {
        email: query.email,
    };
    
    try {
        const doc = await db.collection('users').add(addData);
        const subCollectionData = {
            createdAt: new Date(),
            role: "user"
        };
        await doc.collection('printData');
        return true;
    } catch (error) {
        console.error("Error creating user or subcollection:", error);
        return false;
    }
};

module.exports = router;