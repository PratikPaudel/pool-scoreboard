import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, speed = 22 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount < value) {
                    return currentCount + 1;
                }
                clearInterval(interval);
                return value;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [value, speed]);

    return <span>{count}</span>;
};

export default AnimatedCounter;