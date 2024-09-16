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
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState<any>(null);
    const [stageData, setStageData] = useState<any>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [worldCss, setWorldCss] = useState('');
    const {
        supabase,
        session,
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

    const handleSave = async () => {
        // save every editor code and score
        const tree = stageData.tree.map((object: any) => ({className: object.className, css: object.css}));
        const jsonCss = {
            tree,
            worldCss
        }
        console.log('jsonEditors', jsonCss)
        // save on supabase games table
        const {data, error} = await supabase.from('stages').upsert({
            user_id: session.user.id,
            stage,
            css: jsonCss,
            score: rank,
            raw_score: rank
        }, {
            returning: 'minimal'
        })

        console.log('data', data)
        console.log('error', error)
    }


    const loadStage = useCallback(async () => {
        const response = await fetch(`/stages/${stage}/index.json`);
        const data = await response.json();
        setHeight(data.height);
        setWidth(data.width);
        setStageData(data);

    }, [stage]);

    const loadUserData = useCallback(async () => {
        // get data from stage and user id from supabase stages
        let {data} = await supabase.from('stages').select('*').eq('user_id', userId).eq('stage', stage)
        data = data[0]
        console.log('data>>', data)
        setUserData(data);
    }, [userId, stage]);


    useEffect(() => {
        if (session?.user?.id) {
            setUserId(session.user.id)
        }
    }, [session]);

    useEffect(() => {
        if (userId && stageData) {
            loadUserData()
        }
    }, [userId, stageData]);

    useEffect(() => {
        if (stageData && expectedRef.current) {
            loadImageToCanvas(stageData.expected.src, expectedRef)
        }
    }, [stageData, expectedRef]);

    useEffect(() => {
        loadStage()
    }, [stage]);


    const resizeImage = () => {
        const viewportWidth = window.innerWidth - 429;
        const newScaleFactor = viewportWidth < width ? viewportWidth / width : 1;
        setScaleFactor(newScaleFactor);
    };

    useEffect(() => {
        if (!width) {
            return;
        }
        resizeImage();
        window.addEventListener('resize', resizeImage);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('resize', resizeImage);
    }, [width]);


    if (!width || !height || !stageData) {
        return (<></>)
    }

    console.log('data stage extra: ', stageData, userData)

    return (
        <>
            <MusicLoop src={stageData.music}/>

            <div className={styles.wrapper}>
                <div className={styles.tools}>


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
                                    <CodeEditor
                                        initialCode={userData ?
                                            userData.css.tree.find((item: any) => item.className === object.className)?.css ?? object.initialCss
                                            : object.initialCss}
                                        identifier={'main'} onChange={
                                        (css) => object.css = css
                                    }/>
                                </div>
                            )
                        })}
                        <div>
                            <h2>
                                .worldWrapper Editor
                            </h2>
                            <CodeEditor
                                initialCode={userData?.css?.worldCss ? userData.css.worldCss : stageData.worldCss.initialCss}
                                identifier={'main'} onChange={
                                setWorldCss
                            }/>
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
                        <main ref={mainRef} id={'main'} style={{width: `${width}px`, height: `${height}px`}}>
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
                            <div ref={diffRef} className={cns(styles.diff, showDiff && styles.showDiff)}>
                            </div>
                            <div ref={resultsRef} className={'results'}>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div ref={expectedRef} className={'expected'}>
                        </div>
                        <button onClick={handleSave}>Save</button>
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
