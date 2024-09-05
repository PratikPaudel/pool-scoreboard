// app/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PoolTable from './components/PoolTable'; // Import the PoolTable component

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
        <div className="relative py-4 md:py-10 flex flex-col gap-8 sm:gap-10 items-center">
            <PoolTable /> {/* Add the PoolTable component */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-center font-extrabold">
                <span className="text-white-600">Pool Game Score Tracker </span>
            </h1>
            <div className={"flex flex-row gap-4 sm:gap-6 items-center"}>
                <a href="" target="_blank" rel="noopener noreferrer">
                    <div className="card">
                        <div className="wrapper">
                            <div className="text-center">
                                <h1 className="text-6xl background-animate bg-gradient-to-r from-indigo-500 via-green-500 to-pink-500 bg-clip-text flex justify-center items-center content-center w-full text-transparent text-6xl select-none py-10"> {scores.pratik} </h1>
                            </div>
                            <img src="/pratik.png"
                                 className="cover-image" alt="Pratik Paudel"/>
                        </div>
                        <img src="/title-pratik.png" className="title"
                             alt="Pratik Paudel"/>
                        <img src="/hover-one.png"
                             className="character" alt="Pratik Paudel"/>
                    </div>
                </a>

                <a href="" target="_blank" rel="noopener noreferrer">
                    <div className="card">
                        <div className="wrapper">
                            <div className="text-center">
                                <h3 className="text-6xl background-animate bg-gradient-to-r from-purple-500 via-white-500 to-yellow-500 bg-clip-text flex justify-center items-center content-center w-full text-transparent text-6xl select-none py-10">{scores.nick}</h3>
                            </div>
                            <img src="/nick.png"
                                 className="cover-image" alt=""/>
                        </div>
                        <img src="/title-nick.png" className="title"
                             alt="Nick Batcheller"/>
                        <img src="/hover-two.png"
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