import {useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import Editor, {DiffEditor, useMonaco, loader} from '@monaco-editor/react';


type CodeEditorProps = {
    identifier: string;
    initialCode: string;
}

export default function CodeEditor({initialCode, identifier}: CodeEditorProps) {
    const {
        handleDiff,
    } = useGameContext();
    const [cssCode, setCssCode] = useState(initialCode);

    const handleChange = (css: string) => {
        setCssCode(css);
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
        <Editor
            defaultLanguage="scss"
            theme="vs-dark"
            height={300}
            width={400}
            defaultValue={cssCode}
            options={{
                minimap: {enabled: false},
            }}
            onChange={handleChange}
        />
    );
}
