'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase'; // Adjust the import path if needed
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [scores, setScores] = useState({ pratik: 0, nick: 0 });
    const [error, setError] = useState('');
    const router = useRouter(); // Use Next.js router for redirection

    // Fetch scores from Firestore
    const fetchScores = async () => {
        try {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = { pratik: 0, nick: 0 };

            scoresSnapshot.forEach(doc => {
                scoresData[doc.id] = doc.data().score || 0;
            });

            setScores(scoresData);
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError('Failed to fetch scores');
        }
    };

    // Update score for a player
    const updateScore = async (player) => {
        try {
            const playerDocRef = doc(db, 'scores', player);
            const playerDoc = await getDoc(playerDocRef);

            if (!playerDoc.exists()) {
                setError(`Player ${player} not found`);
                return;
            }

            // Increment the player's score
            const currentScore = playerDoc.data().score || 0;
            const newScore = currentScore + 1;

            // Update the score in Firestore
            await updateDoc(playerDocRef, { score: newScore });

            // Refresh scores after update
            fetchScores();
        } catch (err) {
            console.error('Error updating score:', err);
            setError('Failed to update score');
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/'); // Redirect to homepage after logout
        } catch (err) {
            console.error('Error logging out:', err);
            setError('Failed to log out');
        }
    };

    // Fetch the scores when the component mounts
    useEffect(() => {
        fetchScores();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h3 className="mt-6 text-center text-2xl text-gray-500">
                        Welcome to the Admin Dashboard
                    </h3>
                    <div className="mt-6 text-center text-2xl text-gray-600">
                        <h3>Who won the last game?</h3>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        className="w-full text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                        onClick={() => updateScore('nick')}
                    >
                        Nick
                    </button>
                    <button
                        className="w-full text-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                        onClick={() => updateScore('pratik')}
                    >
                        Pratik
                    </button>
                </div>

                <div className="flex justify-between items-center text-black p-6 rounded-lg shadow-lg border-black">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg">Nick</div>
                        <div className="text-sm">Score: {scores.nick}</div>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg">Pratik</div>
                        <div className="text-sm">Score: {scores.pratik}</div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="text-center bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
