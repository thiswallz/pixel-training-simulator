import {createContext, useContext, FC, ReactNode, useState, useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import pixelmatch from "pixelmatch";

interface GameContextState {
    width: number;
    setWidth: (width: number) => void;
    height: number;
    setHeight: (height: number) => void;
    userId: string | null;
    mainRef: React.RefObject<any>;
    resultsRef: React.RefObject<any>;
    expectedRef: React.RefObject<any>;
    diffRef: React.RefObject<any>;
    rank: number;
    setRank: (rank: number) => void;
    handleDiff: () => void;
    loadImageToCanvas: (url: string, myRef: any) => void;
    showDiff: boolean;
    setShowDiff: (showDiff: boolean) => Promise<void>;
}

async function loadImageToCanvas(url: string, myRef: any) {
    return new Promise((resolve, reject) => {
        console.log('loading image', url, myRef.current);
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle cross-origin images
        img.onload = () => {
            const canvas = document.createElement('canvas');
            if (myRef.current) {
                myRef.current.innerHTML = '';
            }
            myRef.current.appendChild(canvas);
            console.log('canvas', canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            // @ts-ignore
            ctx.drawImage(img, 0, 0);
            // @ts-ignore
            resolve(ctx.getImageData(0, 0, img.width, img.height));
        };
        img.onerror = reject;
        img.src = url;
    });
}


const GameContext = createContext<GameContextState | undefined>(
    undefined
);

export const GameProvider: FC<{
    children: ReactNode;
}> = ({children}) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const mainRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const expectedRef = useRef<HTMLDivElement>(null);
    const diffRef = useRef<HTMLDivElement>(null);
    const [rank, setRank] = useState(0);
    const [showDiff, setShowDiff] = useState(false);

    const executeDiff = () => {
        if (!expectedRef.current || !resultsRef.current || !diffRef.current) {
            return;
        }
        // @ts-ignore
        const img1Context = expectedRef.current.querySelector('canvas').getContext('2d');
        // @ts-ignore
        const img2Context = resultsRef.current.querySelector('canvas').getContext('2d');

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        if (diffRef.current) {
            diffRef.current.innerHTML = '';
        }
        diffRef.current.appendChild(canvas);
        // @ts-ignore
        const diffContext = diffRef.current.querySelector('canvas').getContext('2d');


        if (img1Context && img2Context && diffContext) {
            const img1 = img1Context.getImageData(0, 0, width, height);
            const img2 = img2Context.getImageData(0, 0, width, height);
            const diff = diffContext.createImageData(width, height);

            const results = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.2});
            setRank(results);

            diffContext.putImageData(diff, 0, 0);
        }
    }

    const handleDiff = async () => {
        if (!expectedRef.current || !resultsRef.current || !diffRef.current) {
            return;
        }
        if (mainRef.current && resultsRef.current) {
            const element = mainRef.current;
            element.offsetHeight;
            console.log('canvas', width, height);
            await html2canvas(element, {
                windowWidth: width,
                windowHeight: height,
                scale: 1,
            }).then((canvas) => {
                if (width && height) {
                    // canvas.width = width;
                    //canvas.height = height;
                }
                if (resultsRef.current) {
                    resultsRef.current.innerHTML = '';
                }
                resultsRef.current?.appendChild(canvas);
            });
        }

        setTimeout(() => {
            executeDiff();
        }, 50)

    }

    const contextValue: GameContextState = {
        userId: 'initial',
        width,
        setWidth,
        height,
        setHeight,
        mainRef,
        resultsRef,
        expectedRef,
        diffRef,
        rank,
        setRank,
        handleDiff,
        loadImageToCanvas,
        showDiff,
        setShowDiff,
    };


    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = (): GameContextState => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context
};
