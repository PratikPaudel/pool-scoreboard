'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import '/public/global.css';

const Home = () => {
    const [scores, setScores] = useState({ pratik: 0, nick: 0 });

    useEffect(() => {
        const fetchScores = async () => {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = {};

            scoresSnapshot.forEach(doc => {
                scoresData[doc.id] = doc.data().score;
            });

            setScores(scoresData);
        };

        fetchScores();
    }, []);

    return (
        <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10 items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-center font-extrabold">
                <span className="text-blue-600">Pool Game Score Tracker </span>
            </h1>
            <div className={"flex flex-row gap-4 sm:gap-6 items-center"}>
            <a href="" target="_blank" rel="noopener noreferrer">
                <div className="card">
                    <div className="wrapper">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-green-600 mb-2"> {scores.pratik} </h3>
                        </div>
                        <img src="first-image.png"
                             className="cover-image" alt="Pratik Paudel"/>
                    </div>
                    <img src="title-first" className="title"
                         alt="Pratik Paudel"/>
                    <img src="first-image-hover.webp"
                         className="character" alt="Pratik Paudel"/>
                </div>
            </a>

            <a href="" target="_blank" rel="noopener noreferrer">
                <div className="card">
                    <div className="wrapper">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{scores.nick}</h3>
                        </div>
                        <img src="first-image.png"
                             className="cover-image" alt=""/>
                    </div>
                    <img src="title-second-image" className="title"
                         alt="Nick Batcheller"/>
                    <img src="2nd-image-hover.webp"
                         className="character" alt="Nick Batcheller"/>
                </div>
            </a>
            </div>
            <div className="w-full max-w-md">
                <button
                    className="w-full text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                    <a href="/admin"> Admin Login </a>
                </button>
            </div>
        </div>
    );
};

export default Home;