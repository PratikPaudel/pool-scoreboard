import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { db } from '@/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
    const [scores, setScores] = useState({ you: 0, roommate: 0 });
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/admin/login');
            }
        });

        fetchScores();

        return () => unsubscribe();
    }, [router]);

    const fetchScores = async () => {
        const scoresCollection = collection(db, 'scores');
        const scoresSnapshot = await getDocs(scoresCollection);
        const scoresData = scoresSnapshot.docs[0]?.data() || { you: 0, roommate: 0 };
        setScores(scoresData);
    };

    const handleScoreUpdate = async (player) => {
        const newScores = { ...scores, [player]: scores[player] + 1 };
        const scoresCollection = collection(db, 'scores');
        const scoresSnapshot = await getDocs(scoresCollection);

        if (scoresSnapshot.empty) {
            await addDoc(scoresCollection, newScores);
        } else {
            const scoreDoc = scoresSnapshot.docs[0];
            await updateDoc(doc(db, 'scores', scoreDoc.id), newScores);
        }

        setScores(newScores);
    };

    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <p>Current Scores:</p>
                                <p>Nick: {scores.you}</p>
                                <p>Pratik: {scores.roommate}</p>
                                <div className="flex space-x-4">
                                    <button onClick={() => handleScoreUpdate('you')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Nick Scored
                                    </button>
                                    <button onClick={() => handleScoreUpdate('roommate')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        Pratik Scored
                                    </button>
                                </div>
                            </div>
                            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                                <button onClick={handleLogout} className="text-blue-600 hover:text-blue-800">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;