import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = scoresSnapshot.docs[0]?.data() || { you: 0, roommate: 0 };

            res.status(200).json(scoresData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch scores' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
