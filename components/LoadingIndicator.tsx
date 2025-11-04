import React, { useState, useEffect } from 'react';
import { PlaneIcon } from './icons/PlaneIcon';
import { SunnyIcon } from './icons/SunnyIcon';
import { PalmTreeIcon } from './icons/PalmTreeIcon';
import { CocktailIcon } from './icons/CocktailIcon';
import { BlackBeardIcon } from './icons/BlackBeardIcon';

interface LoadingIndicatorProps {
  message: string;
}

const loadingPrompts = [
  "Get ready for a great trip.",
  "You're going to have a good time.",
  "Things are really going to look up for you guys.",
  "Paradise is calling...",
  "Just a moment while we check the sea breeze.",
  "They are waiting for you at 'Barba Negra'",
];

const iconComponents = [
    { Icon: PlaneIcon, animation: 'animate-gentle-fly', color: 'text-blue-400' },
    { Icon: SunnyIcon, animation: 'animate-pulse-bright', color: 'text-yellow-400' },
    { Icon: PalmTreeIcon, animation: 'animate-sway', color: 'text-green-400' },
    { Icon: CocktailIcon, animation: 'animate-pulse-bright', color: 'text-pink-400' },
    { Icon: BlackBeardIcon, animation: 'animate-pulse-bright', color: 'text-gray-300' },
];

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    const [displayItem, setDisplayItem] = useState(() => {
        const prompt = loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)];
        const icon = iconComponents[Math.floor(Math.random() * iconComponents.length)];
        return { prompt, icon };
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDisplayItem(prevItem => {
                let newPrompt;
                do {
                    newPrompt = loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)];
                } while (newPrompt === prevItem.prompt && loadingPrompts.length > 1);

                let newIcon;
                do {
                    newIcon = iconComponents[Math.floor(Math.random() * iconComponents.length)];
                } while (newIcon === prevItem.icon && iconComponents.length > 1);

                return { prompt: newPrompt, icon: newIcon };
            });
        }, 1800); // Change every 1.8 seconds

        return () => clearInterval(intervalId);
    }, []);

    const { Icon, animation, color } = displayItem.icon;

    return (
        <div className="text-center py-20">
          <div key={displayItem.prompt} className="animate-fade-in">
            <div className="flex justify-center items-center h-24 mb-6">
                <div className={`w-24 h-24 ${color} ${animation}`}>
                    <Icon />
                </div>
            </div>
            <p className="text-lg mt-4 text-gray-400 animate-pulse">
                {message}
            </p>
            <p className="text-xl font-semibold text-gray-200 mt-2">
                "{displayItem.prompt}"
            </p>
          </div>
        </div>
    );
};

export default LoadingIndicator;