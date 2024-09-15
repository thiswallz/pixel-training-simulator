import React, {useRef, useEffect, useState} from 'react';

type MusicLoopProps = {
    src: string;
}

const MusicLoop = ({src}: MusicLoopProps) => {
    const audioRef = useRef(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    const startPlayback = () => {
        const audio = audioRef.current as any;
        if (audio) {
            audio.loop = true; // Set the audio to loop
            audio.volume = 0.2; // Set the volume to 10%
            setTimeout(() => {
                audio.play(); // Start playing the audio
            }, 1000)
        }
        // Cleanup on component unmount
        return () => {
            if (audio) {
                audio.stop();
                audio.currentTime = 0;
            }
        };
    }

    useEffect(() => {
        const handleUserInteraction = () => {
            setHasInteracted(true);
            startPlayback();
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [hasInteracted]);


    console.log('hasInteracted', hasInteracted)

    return (
        <audio ref={audioRef} src={src}/>
    );
};

export default MusicLoop;
