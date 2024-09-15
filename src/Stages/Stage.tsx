'use client';
import {useCallback, useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import CodeEditor from "@/UI/CodeEditor/CodeEditor";
import styles from "./Stage.module.scss";
import cns from "classnames";
import MusicLoop from "@/Stages/Music/Music";

type StageProps = {
    stage: string;
}

export default function Stage({stage}: StageProps) {
    const [stageData, setStageData] = useState<any>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const {
        loadImageToCanvas,
        mainRef,
        expectedRef,
        rank,
        width,
        height,
        setWidth,
        setHeight,
        diffRef,
        resultsRef,
        showDiff,
        setStage,
        setShowDiff
    } = useGameContext();


    const loadStage = useCallback(async () => {
        console.log('load stage', stage);
        const response = await fetch(`/stages/${stage}/index.json`);
        const data = await response.json();
        console.log('stage data', data);
        setHeight(data.height);
        setWidth(data.width);
        setStageData(data);
    }, [stage]);

    useEffect(() => {
        if (stageData && expectedRef.current) {
            loadImageToCanvas(stageData.expected.src, expectedRef)
        }
    }, [stageData, expectedRef]);

    useEffect(() => {
        console.log('load stage effect', stage);
        loadStage()
    }, [stage]);


    const resizeImage = () => {
        const viewportWidth = window.innerWidth - 429;
        const newScaleFactor = viewportWidth < width ? viewportWidth / width : 1;
        console.log('resize', viewportWidth, width, newScaleFactor);
        setScaleFactor(newScaleFactor);
    };

    useEffect(() => {
        if (!width) {
            return;
        }
        console.log('resize effect', width);
        // Call resizeImage on mount and add event listener for window resize
        resizeImage();
        window.addEventListener('resize', resizeImage);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('resize', resizeImage);
    }, [width]);


    if (!width || !height || !stageData) {
        return (<></>)
    }

    return (
        <>
            <MusicLoop src={stageData.music}/>

            <div className={styles.wrapper}>
                <div className={styles.tools}>
                    <div ref={expectedRef} className={'expected'}>
                    </div>
                    <div className={styles.toolbar}>
                        <button>
                            Login
                        </button>
                        <button>
                            Share it
                        </button>
                    </div>
                    <div className={styles.editor}>
                        {stageData.tree.map((object: any) => {
                            return (
                                <div key={object.className}>
                                    <h2>
                                        {
                                            object.children ? object.children.map((child: any, index: number) => {
                                                return (
                                                    <img key={index} className={styles.editorObject} src={child.src}/>
                                                )
                                            }) : (
                                                <img className={styles.editorObject} src={object.src}/>
                                            )
                                        }
                                        .{object.className} Editor
                                    </h2>
                                    <CodeEditor initialCode={object.initialCss} identifier={'main'}/>
                                </div>
                            )
                        })}
                        <div>
                            <h2>
                                .worldWrapper Editor
                            </h2>
                            <CodeEditor initialCode={`.worldWrapper{}`} identifier={'main'}/>
                        </div>
                        Rank {rank}
                    </div>
                </div>

                <div>
                    <div>
                        <button onClick={() => setShowDiff(!showDiff)}>
                            {showDiff ? 'Hide' : 'Show'} diff
                        </button>
                        <button>
                            Figma
                        </button>
                    </div>
                    <div>
                        Progress:
                    </div>
                    <div className={styles.mainWrapper}>
                        <main ref={mainRef} id={'main'}

                              style={{
                                  width: `${width}px`,
                                  height: `${height}px`,
                              }}>
                            <section className={'worldWrapper'}>
                                {stageData.tree.map((object: any) => {
                                    if (object.src) {
                                        object.repeat = object.repeat || 1;
                                        return Array.from({length: object.repeat}).map((_, j) => {
                                            return (
                                                <img key={object.className} className={object.className}
                                                     src={object.src}/>
                                            )
                                        })
                                    } else {
                                        return (
                                            <div key={object.className} className={object.className}>
                                                {
                                                    object.children.map((child: any, index: number) => {
                                                        console.log('repeat', child.repeat);
                                                        child.repeat = child.repeat || 1;
                                                        return Array.from({length: child.repeat}).map((_, j) => {
                                                                return (
                                                                    <img key={`${child.className}-${index}-${j}`}
                                                                         className={child.className}
                                                                         src={child.src}/>
                                                                )
                                                            }
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                })}
                            </section>
                            {stageData.base &&
                                <img className={stageData.base.className} src={stageData.base.src}/>}

                        </main>
                        <div className={'diffWrapper'}>
                            <div ref={diffRef} className={cns(styles.diff, showDiff && styles.showDiff)}

                            >
                            </div>

                            <div ref={resultsRef} className={'results'}>
                            </div>
                        </div>
                    </div>

                    <div>
                        Stages ({stage}):
                        <div>
                            <button onClick={() => setStage('001')}>001</button>
                            <button onClick={() => setStage('002')}>002</button>
                            <button onClick={() => setStage('003')}>003</button>
                        </div>

                    </div>
                </div>

            </div>
        </>

    );
}
