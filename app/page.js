// app/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PoolTable from './components/PoolTable'; // Import the PoolTable component

import '/public/global.css';
import AnimatedCounter from "./components/animatedcounter";

import TrophyIcon from "./components/trophy";
import Header from "./components/header";

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
    const text = "Pool Game Score Tracker";
    const getWinner = () => {
        if (scores.pratik > scores.nick) return 'pratik';
        if (scores.nick > scores.pratik) return 'nick';
        return null; // It's a tie
    };
    const winner = getWinner();
    return (
        <div className="relative py-4 md:py-10 flex flex-col gap-8 sm:gap-10 items-center">
            <PoolTable/> 
            <Header/> 
            <h1 className="sm:text-5xl md:text-8xl text-center font-bold py-6">
            <span className="overflow-hidden bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                {text.match(/./gu).map((char, index) => (
                    <span
                    className="animate-text-reveal inline-block [animation-fill-mode:backwards]"
                    key={`${char}-${index}`}
                style={{animationDelay: `${index * 0.05}s`}}
            >
                {char === " " ? "\u00A0" : char}
            </span>
            ))}
        </span>
            </h1>
            <div className={"flex flex-row gap-4 sm:gap-6 items-center"}>
                <div className="card relative">
                    {winner === 'pratik' && (
                        <div className="absolute -top-4 -right-4 z-10">
                            <TrophyIcon className="w-12 h-12 text-yellow-400" />
                        </div>
                    )}
                    <div className="wrapper">
                        <div className="text-center">
                            <h1 className="text-9xl background-animate text-white flex justify-center items-center content-center w-full select-none py-10">
                                <AnimatedCounter value={scores.pratik} speed={50} />
                            </h1>
                        </div>
                        <img src="/pratik.png" className="cover-image" alt="Pratik Paudel"/>
                    </div>
                    <img src="/title-pratik.png" className="title" alt="Pratik Paudel"/>
                    <img src="/hover-one.png" className="character" alt="Pratik Paudel"/>
                </div>

                <div className="card relative">
                    {winner === 'nick' && (
                        <div className="absolute -top-4 -right-4 z-10">
                            <TrophyIcon className="w-12 h-12 text-yellow-400" />
                        </div>
                    )}
                    <div className="wrapper">
                        <div className="text-center">
                            <h1 className="text-9xl background-animate text-white flex justify-center items-center content-center w-full select-none py-10">
                                <AnimatedCounter value={scores.nick} speed={50} />
                            </h1>
                        </div>
                        <img src="/nick.png" className="cover-image" alt=""/>
                    </div>
                    <img src="/title-nick.png" className="title" alt="Nick Batcheller"/>
                    <img src="/hover-two.png" className="character" alt="Nick Batcheller"/>
                </div>
            </div>
        </div>
    );
};

export default Home;