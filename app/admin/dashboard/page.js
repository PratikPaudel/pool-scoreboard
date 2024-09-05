'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; 

const Dashboard = () => {
    const [scores, setScores] = useState({ pratik: 0, nick: 0 });
    const [error, setError] = useState('');

    // Fetch scores from Firestore
    const fetchScores = async () => {
        try {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = {};

            scoresSnapshot.forEach(doc => {
                scoresData[doc.id] = doc.data().score;
            });

            setScores(scoresData);
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError('Failed to fetch scores');
        }
    };

    // Update score for a player (This function will remain as is if you are still using the API for updating)
    const updateScore = async (player) => {
        try {
            const response = await fetch('../../api/update-scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player }),
            });
            if (response.ok) {
                fetchScores(); // Refresh scores after update
            } else {
                setError('Failed to update score');
            }
        } catch (err) {
            console.error('Error updating score:', err);
            setError('Failed to update score');
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
                <div className="flex justify-between items-center text-xl font-bold text-black p-6 rounded-lg shadow-lg">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg">Nick</div>
                        <div className="text-sm">Score: {scores.nick}</div>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg">Pratik</div>
                        <div className="text-sm">Score: {scores.pratik}</div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
