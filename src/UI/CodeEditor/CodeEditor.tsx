import {useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import Editor from '@monaco-editor/react';
import {compileString} from 'sass';
import {BsFiletypeScss} from "react-icons/bs";
import styles from './CodeEditor.module.scss';

type CodeEditorProps = {
    identifier: string;
    initialCode: string;
    onChange: (css: string) => void;
}

const compileSass = (code: string) => {
    try {
        const result = compileString(code);
        return result.css;
    } catch (error) {
        console.error('Sass compilation error:', error);
        return '';
    }
};

export default function CodeEditor({initialCode, identifier, onChange}: CodeEditorProps) {
    const {
        handleDiff,
    } = useGameContext();
    const [cssCode, setCssCode] = useState(initialCode);

    const handleChange = (css: string) => {
        setCssCode(css);
        console.log('css', css)
        onChange(css);
    };

    useEffect(() => {
        // Create a <style> element to inject CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'live-css-style';
        document.head.appendChild(styleElement);

        // Function to update the CSS content
        const updateCss = (newCss: string) => {
            const compiledCss = compileSass(newCss);
            console.log('compiledCss', compiledCss)

            const cssToInject = `
            #${identifier} {
                ${compiledCss}
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
            document.head?.removeChild(styleElement);
        };
    }, [cssCode]);

    useEffect(() => {
        console.log('initialCode', initialCode)
        handleChange(initialCode);
    }, [initialCode]);

    return (
        <div className={styles.editorWrapper}>
            <Editor
                className={'editor'}
                defaultLanguage="scss"
                theme="vs-dark"
                height={300}
                width={260}
                value={cssCode}
                options={{
                    minimap: {enabled: false},
                }}
                onChange={handleChange}
            />
            <BsFiletypeScss className={styles.icon}/>
        </div>

    );
}
