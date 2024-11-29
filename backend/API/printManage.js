const express = require('express');
const router = express.Router();
const db = require('../index.js');

router.post('/create' , async (req, res) => {
    try {
        const body = req.body;
        const header = req.headers;
        const user = body.user;

        const printData = {
            title:body.title,
            date:body.date,
            exp:body.exp,
            submit1:body.submit1,
            submit2:body.submit2,
            tag:body.tag,
        }

        const collectionName = 'users';

        const snapshot = await db.collection(collectionName).where('email', '==', user).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        snapshot.forEach(async (doc) => {
            const userDocRef = db.collection(collectionName).doc(doc.id);
            await userDocRef.collection('printData').add(printData); 
            res.status(200).json({ message: 'Print data added successfully' });
        });
    } catch {
        console.error('Error adding print data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/get/:userEmail', async (req, res) => {
    const query = req.query;
    try {
        const userEmail = req.params.userEmail; 
        const query = req.query;
        const collectionName = 'users';

        const snapshot = await db.collection(collectionName)
        .where('email', '==', userEmail)
        .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        let allPrintData = [];

        await Promise.all(snapshot.docs.map(async (doc) => {
            const printDataSnapshot = await db.collection(collectionName)
                .doc(doc.id)
                .collection('printData')
                .get();

            printDataSnapshot.forEach((printDoc) => {
                allPrintData.push({
                    id: printDoc.id,
                    ...printDoc.data(),
                });
            });
        }));

        allPrintData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date); // 降順で並び替え
        });
        console.log(allPrintData.length);
        console.log(query.tag);

        allPrintData = allPrintData.filter((a) => {
            if (query.tag === "all") return true; // 全データを返す
            return a.tag.trim().toLowerCase() === query.tag.trim().toLowerCase();
        });             

        console.log(allPrintData.length);
        return res.status(200).json(allPrintData);
    } catch (error) {
        console.error('Error retrieving print data:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports = router;