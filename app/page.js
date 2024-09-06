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
        <div className="relative py-4 md:py-10 flex flex-col gap-8 sm:gap-10 items-center">
            <PoolTable/>
            <Header/>
            <h1 className="sm:text-5xl md:text-8xl text-center font-bold py-6">
                <span
                    className="overflow-hidden bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
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
            <div className="w-full max-w-3xl bg-gray-200 rounded-full h-8 mb-4">
                <div
                    className="bg-blue-600 h-8 rounded-full transition-all duration-500 ease-in-out"
                    style={{width: `${predictionPercents.pratik}%`}}
                />
            </div>
            <div className="text-center mb-6">
                <p className="text-lg font-semibold">
                    {predictionPercents.pratik.toFixed(1)}% of users think Pratik will win the next game
                </p>
                <p className="text-lg font-semibold">
                    {predictionPercents.nick.toFixed(1)}% of users think Nick will win the next game
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    Total predictions: {totalPredictions}
                </p>
            </div>

            <div className="flex flex-row gap-4 sm:gap-6 items-center">
                {['pratik', 'nick'].map(player => (
                    <div key={player} className="card relative">
                        {winner === player && (
                            <div className="absolute -top-4 -right-4 z-10">
                                <TrophyIcon className="w-12 h-12 text-yellow-400"/>
                            </div>
                        )}
                        <div className="wrapper">
                            <div className="text-center">
                                <h1 className="text-9xl background-animate text-white flex justify-center items-center content-center w-full select-none py-10">
                                    <AnimatedCounter value={scores[player]} speed={50}/>
                                </h1>
                            </div>
                            <img src={`/${player}.png`} className="cover-image" alt={player}/>
                        </div>
                        <img src={`/title-${player}.png`} className="title" alt={`${player} title`}/>
                        <img src={`/hover-${player === 'pratik' ? 'one' : 'two'}.png`} className="character"
                             alt={player}/>
                    </div>
                ))}
            </div>

            {/* Prediction buttons */}
            <div className="flex flex-row gap-4 sm:gap-6 justify-center mt-4">
                {['pratik', 'nick'].map(player => (
                    <button
                        key={player}
                        onClick={() => handlePrediction(player)}
                        className={`mt-2 px-4 py-2 rounded ${userPrediction === player ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                        disabled={userPrediction !== null}
                    >
                        Predict {player.charAt(0).toUpperCase() + player.slice(1)} Wins Next Game
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;