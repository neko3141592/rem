const express = require('express');
const router = express.Router();
const db = require('../index.js');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yudai3.1415926@gmail.com', 
        pass: 'gkwj sjui npag khbp'  
    }
});

const calcDate = (date , calling) => {
    const inputDate = new Date(date); 
    inputDate.setDate(inputDate.getDate() - calling); 
    return inputDate.toISOString();
}

router.post('/create' , async (req, res) => {
    try {
        const body = req.body;
        const header = req.headers;
        const user = body.user;

        let mailData = [{before: 1, calling: calcDate(body.date, 1), sent:false}];

        const printData = {
            title:body.title,
            date:body.date,
            exp:body.exp,
            submit1:body.submit1,
            submit2:body.submit2,
            tag:body.tag,
            mails: mailData,
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
            if (query.tag === "all") return true; 
            return a.tag.trim().toLowerCase() === query.tag.trim().toLowerCase();
        });    
        
        allPrintData.sort((a, b) => {
            return new Date(a.date) - new Date(b.date); 
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
        const userEmail = req.params.userEmail; 
        const id = req.query.id; 

        if (!id) {
            return res.status(400).json({ message: "Document ID is required" });
        }

        const collectionName = 'users';

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


cron.schedule('*/10 * * * * *', async () => {
    console.log('Checking for emails to send...');

    try {
        const collectionName = 'users';

        const usersSnapshot = await db.collection(collectionName).get();
        if (usersSnapshot.empty) {
            console.log('No users found');
            return;
        }

        await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
            const printDataSnapshot = await userDoc.ref.collection('printData').get();
            if (printDataSnapshot.empty) {
                return;
            }

            const userData = userDoc.data();
            console.log(userData);
            printDataSnapshot.forEach(async (printDoc) => {
                const printData = printDoc.data();
                const scheduledTime = new Date(printData.mails[0].calling);
                const isSent = printData.mails[0].sent;
                console.log(printData.mails[0].sent);

                if (scheduledTime <= new Date() && !isSent) {
                    console.log(`Sending email for ${printDoc.id}`);

                    const mailOptions = {
                        from: 'yudai3.1415926@gmail.com',
                        to: userData.email,
                        subject: `${printData.title}の期限が近づいています`,
                        text: `
                            あなたのプリント『${printData.title}』が期限の${printData.mails[0].before}日前になりました！
                            忘れないように確認をし、ファイルに入れておきましょう！\n \n
                            【詳細はこちら】
                            https://rem-docs.vercel.app/documents/${printDoc.id}
                        `,
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                        console.log(`Email sent for ${printDoc.id}`);
                        const updatedMails =printData.mails.map(mail => {
                            return { ...mail, sent: true };
                        });
                        await userDoc.ref.collection('printData').doc(printDoc.id).update({ mails:updatedMails });
                    } catch (error) {
                        console.error(`Error sending email for ${printDoc.id}:`, error);
                    }
                }
            });
        }));
    } catch (error) {
        console.error('Error in scheduled email task:', error);
    }
});


module.exports = router;