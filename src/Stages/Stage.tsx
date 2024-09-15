'use client';
import {useCallback, useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import CodeEditor from "@/UI/CodeEditor/CodeEditor";

type StageProps = {
    stage: string;
}

export default function Stage({stage}: StageProps) {
    const [stageData, setStageData] = useState<any>(null);
    const {
        loadImageToCanvas,
        mainRef,
        expectedRef,
        rank,
        width,
        height,
        setWidth,
        setHeight,
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

    console.log('re rendering', stage)


    if (!width || !height || !stageData) {
        return (<></>)
    }

    return (
        <>

            <main ref={mainRef} id={'main'} style={{
                width: `${width}px`,
                height: `${height}px`
            }}>
                <section className={'worldWrapper'}>
                    {stageData.tree.map((object: any) => {
                        if (object.src) {
                            object.repeat = object.repeat || 1;
                            return Array.from({length: object.repeat}).map((_, j) => {
                                return (
                                    <img key={object.className} className={object.className} src={object.src}/>
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
            Rank {rank}
            {stageData.tree.map((object: any) => {
                return (
                    <div key={object.className}>
                        <h2>.{object.className} Editor</h2>
                        <CodeEditor initialCode={object.initialCss} identifier={'main'}/>
                    </div>
                )
            })}
            <div>
                <h2>.worldWrapper Editor</h2>
                <CodeEditor initialCode={`.worldWrapper{}`} identifier={'main'}/>
            </div>
        </>
    );
}
