'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import Link from "next/link";
import { db } from '../firebase';

const Home = () => {
    const [scores, setScores] = useState({ you: 0, roommate: 0 });

    useEffect(() => {
        const fetchScores = async () => {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = scoresSnapshot.docs[0]?.data() || { you: 0, roommate: 0 };
            setScores(scoresData);
        };

        fetchScores();
    }, []);

    return (
        <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10 items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-center font-extrabold text-gray-800">
                <span className="text-blue-600">Pool Game Score Tracker </span>
            </h1>
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2 text-center">
                    Score Board
                </h2>
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Nick</h3>
                        <p className="text-3xl font-bold text-blue-600">{scores.you}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Pratik</h3>
                        <p className="text-3xl font-bold text-red-600">{scores.roommate}</p>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-md">
                <Link href="/admin/login" className="block text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                    Admin Login
                </Link>
            </div>
        </div>
    );
};

export default Home;