import {useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";

type CodeEditorProps = {
    identifier: string;
    initialCode: string;
}

export default function CodeEditor({initialCode, identifier}: CodeEditorProps) {
    const {
        handleDiff,
    } = useGameContext();
    const [cssCode, setCssCode] = useState(initialCode);

    const handleChange = (event: any) => {
        const userCssToInject = event.target.value;

        setCssCode(userCssToInject);
    };

    useEffect(() => {
        // Create a <style> element to inject CSS
        console.log('useEffect change style css');
        const styleElement = document.createElement('style');
        styleElement.id = 'live-css-style';
        document.head.appendChild(styleElement);

        // Function to update the CSS content
        const updateCss = (newCss: string) => {
            const cssToInject = `
            #${identifier} {
                ${newCss}
            }
        `
            styleElement.textContent = cssToInject;

            setTimeout(() => {
                handleDiff();
            }, 200)
        };

        // Update CSS when `cssCode` changes
        updateCss(cssCode);

        // Cleanup on unmount
        return () => {
            document.head.removeChild(styleElement);
        };
    }, [cssCode]);

    return (
        <textarea
            value={cssCode}
            onChange={handleChange}
            rows={10}
            cols={50}
            placeholder="Write your CSS here..."
        />
    );
}
