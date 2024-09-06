'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import PoolTable from './components/PoolTable';
import '/public/global.css';
import AnimatedCounter from "./components/animatedcounter";
import TrophyIcon from "./components/trophy";
import Header from "./components/header";

const Home = () => {
    const [scores, setScores] = useState({ pratik: 0, nick: 0 });
    const [predictions, setPredictions] = useState({ pratik: 0, nick: 0 });
    const [predictionPercents, setPredictionPercents] = useState({ pratik: 50, nick: 50 });
    const [userPrediction, setUserPrediction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const scoresCollection = collection(db, 'scores');
            const scoresSnapshot = await getDocs(scoresCollection);
            const scoresData = {};
            const predictionsData = {};

            scoresSnapshot.forEach(doc => {
                const data = doc.data();
                scoresData[doc.id] = data.score;
                predictionsData[doc.id] = data.predictions || 0;
            });

            setScores(scoresData);
            setPredictions(predictionsData);
            updatePredictionPercents(predictionsData);
        };

        fetchData();
    }, []);

    const updatePredictionPercents = (predictionData) => {
        const total = predictionData.pratik + predictionData.nick;
        if (total === 0) {
            setPredictionPercents({ pratik: 50, nick: 50 });
        } else {
            setPredictionPercents({
                pratik: (predictionData.pratik / total) * 100,
                nick: (predictionData.nick / total) * 100
            });
        }
    };

    const handlePrediction = async (player) => {
        if (userPrediction) return; // Prevent multiple predictions

        setUserPrediction(player);
        const newPredictions = {
            ...predictions,
            [player]: predictions[player] + 1
        };
        setPredictions(newPredictions);
        updatePredictionPercents(newPredictions);

        // Update Firestore
        const playerRef = doc(db, 'scores', player);
        await updateDoc(playerRef, {
            predictions: increment(1)
        });
    };

    const text = "Pool Game Score Tracker";
    const getWinner = () => {
        if (scores.pratik > scores.nick) return 'pratik';
        if (scores.nick > scores.pratik) return 'nick';
        return null; // It's a tie
    };
    const winner = getWinner();

    const totalPredictions = predictions.pratik + predictions.nick;

    return (
        <div className="relative py-2 sm:py-4 md:py-10 flex flex-col gap-4 sm:gap-8 md:gap-10 items-center px-4 sm:px-6 md:px-8 max-w-full">
            <PoolTable/>
            <Header/>
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl text-center font-bold py-3 sm:py-6">
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

            {/* Prediction Bar and Insights */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-gray-200 rounded-full h-4 sm:h-6 md:h-8 mb-2 sm:mb-4">
                <div
                    className="bg-blue-600 h-4 sm:h-6 md:h-8 rounded-full transition-all duration-500 ease-in-out"
                    style={{width: `${predictionPercents.nick}%`}}
                />
            </div>
            <div className="text-center mb-3 sm:mb-6">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                    {predictionPercents.nick.toFixed(1)}% think Nick will win
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                    {predictionPercents.pratik.toFixed(1)}% think Pratik will win
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    Total predictions: {totalPredictions}
                </p>
            </div>

            <div className="flex flex-row gap-2 sm:gap-4 md:gap-6 items-center">
                {['pratik', 'nick'].map(player => (
                    <div key={player} className="card relative">
                        {winner === player && (
                            <div>
                                <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-yellow-400"/>
                            </div>
                        )}
                        <div className="wrapper">
                            <div className="text-center">
                                <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl background-animate text-white flex justify-center items-center content-center w-full select-none py-2 sm:py-4 md:py-6 lg:py-10">
                                    <AnimatedCounter value={scores[player]} speed={50}/>
                                </h1>
                            </div>
                            <img src={`/${player}.png`} className="cover-image" alt={player}/>
                        </div>
                        <img src={`/title-${player}.png`} className="title" alt={`${player} title`}/>
                        <img src={`/hover-${player === 'pratik' ? 'one' : 'two'}.png`} className="character" alt={player}/>
                    </div>
                ))}
            </div>

            {/* Prediction buttons */}
            <div className="flex flex-col items-center justify-center mt-4 w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl text-white mb-4 text-center">
                    Who do you think will win the next game?
                </h2>
                <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 md:gap-6 justify-center">
                    {['pratik', 'nick'].map(player => (
                        <button
                            key={player}
                            onClick={() => handlePrediction(player)}
                            type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none rounded-lg border border-white-200 hover:bg-gray-100 hover:text-black focus:z-10 focus:ring-4 focus:ring-yellow-200 dark:focus:ring-gray-700 dark:bg-none dark:text-white-400 dark:border-white-600 dark:hover:text-black dark:hover:bg-white-700"
                            disabled={userPrediction !== null}
                            >
                            {player.charAt(0).toUpperCase() + player.slice(1)}
                        </button>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default Home;