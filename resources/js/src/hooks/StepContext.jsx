// StepContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const StepContext = createContext();

export const StepProvider = ({ children }) => {
    const [completedSteps, setCompletedSteps] = useState([]);

    // Load from localStorage after component mounts
    useEffect(() => {
        const saved = localStorage.getItem('completedSteps');
        if (saved) {
            try {
                setCompletedSteps(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse completedSteps", e);
            }
        }
    }, []);

    const markStepCompleted = (stepNumber) => {
        setCompletedSteps(prev => {
            const newSteps = [...new Set([...prev, stepNumber])];
            localStorage.setItem('completedSteps', JSON.stringify(newSteps));
            return newSteps;
        });
    };

    return (
        <StepContext.Provider value={{ completedSteps, markStepCompleted }}>
            {children}
        </StepContext.Provider>
    );
};

export const useStepContext = () => useContext(StepContext);