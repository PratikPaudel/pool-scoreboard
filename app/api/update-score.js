import { db } from '@/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { player } = req.body;

        try {
            // Get the player's document
            const playerDocRef = doc(db, 'scores', player);
            const playerDoc = await getDoc(playerDocRef);

            if (!playerDoc.exists()) {
                return res.status(404).json({ error: `Player ${player} not found` });
            }

            // Get the current score and increment
            const currentScore = playerDoc.data().score || 0;
            const newScore = currentScore + 1;

            // Update the player's score in Firestore
            await updateDoc(playerDocRef, { score: newScore });

            res.status(200).json({ message: `${player}'s score updated to ${newScore}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update score' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
