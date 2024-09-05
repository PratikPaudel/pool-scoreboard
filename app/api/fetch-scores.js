// fetch-scores.js
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get the 'scores' collection from Firestore
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);

            // Format the scores into an object
            let scoresData = {};
            scoresSnapshot.forEach(doc => {
                scoresData[doc.id] = doc.data().score || 0;
            });

            res.status(200).json(scoresData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch scores' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
