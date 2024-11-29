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

        allPrintData = allPrintData.filter((a) => {
            if (query.tag === "all") return true; // 全データを返す
            return a.tag.trim().toLowerCase() === query.tag.trim().toLowerCase();
        });    
        
        allPrintData.sort((a, b) => {
            return new Date(a.date) - new Date(b.date); // 降順で並び替え
        });

        console.log(allPrintData.length);
        return res.status(200).json(allPrintData);
    } catch (error) {
        console.error('Error retrieving print data:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/get/docs/:userEmail', async (req, res) => {
    try {
        const userEmail = req.params.userEmail; // パスパラメータからユーザーのメールアドレスを取得
        const id = req.query.id; // クエリパラメータからドキュメントIDを取得

        if (!id) {
            return res.status(400).json({ message: "Document ID is required" });
        }

        const collectionName = 'users';

        // ユーザーが存在するか確認
        const snapshot = await db.collection(collectionName)
            .where('email', '==', userEmail)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "User not found" });
        }

        let documentData = null;

        await Promise.all(snapshot.docs.map(async (doc) => {
            const userDocRef = db.collection(collectionName).doc(doc.id);
            const docRef = userDocRef.collection('printData').doc(id);

            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                documentData = {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                };
            }
        }));

        if (!documentData) {
            return res.status(404).json({ message: "Document not found" });
        }
        return res.status(200).json(documentData);
    } catch (error) {
        console.error("Error retrieving document:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


router.delete('/delete/docs/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const { id } = req.query;
        const collectionName = 'users';
        console.log(id);
        const snapshot = await db.collection(collectionName)
            .where('email', '==', userEmail)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deleted = false;

        await Promise.all(snapshot.docs.map(async (doc) => {
            const userDocRef = db.collection(collectionName).doc(doc.id);
            const printDataRef = userDocRef.collection('printData').doc(id);

            const printDataDoc = await printDataRef.get();
            if (!printDataDoc.exists) {
                return;
            }

            await printDataRef.delete();
            deleted = true;
        }));

        if (!deleted) {
            return res.status(404).json({ message: 'Print data not found' });
        }
        return res.status(200).json({ message: 'Print data deleted successfully' });
    } catch (error) {
        console.error('Error deleting print data:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})



module.exports = router;