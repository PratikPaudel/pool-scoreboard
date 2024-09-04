import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { player } = req.body;

        try {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoreDoc = scoresSnapshot.docs[0];
            const currentScores = scoreDoc.data();

            const newScores = { ...currentScores, [player]: currentScores[player] + 1 };

            await updateDoc(doc(db, 'scores', scoreDoc.id), newScores);

            res.status(200).json({ message: 'Score updated successfully!' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update score' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
