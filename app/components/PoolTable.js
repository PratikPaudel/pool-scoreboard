// app/components/PoolTable.js
import React from 'react';
import './PoolTable.css';

const PoolTable = () => {
        return (
            <div className="pool-table w-full h-full fixed top-0 left-0 z-0 blur-lg">
                    <div className="table-carpet"></div>
                    <div className="table-border"></div>

                    {/* pockets */}
                {/* codepen.io/dias-ale/pen/WxbaZG */}
                
                    <div className="pocket top-left"></div>
                    <div className="pocket top-center"></div>
                    <div className="pocket top-right"></div>
                    <div className="pocket bottom-left"></div>
                    <div className="pocket bottom-center"></div>
                    <div className="pocket bottom-right"></div>

                    {/* holes */}
                    <div className="hole top-left"></div>
                    <div className="hole top-center"></div>
                    <div className="hole top-right"></div>
                    <div className="hole bottom-left"></div>
                    <div className="hole bottom-center"></div>
                    <div className="hole bottom-right"></div>

                    {/* cue */}
                    <div className="billiard-cue"></div>
            </div>
        );
};

export default PoolTable;