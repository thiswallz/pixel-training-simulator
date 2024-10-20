'use client';
import {useCallback, useEffect, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import styles from "./Stage.module.scss";
import MusicLoop from "@/Stages/Music/Music";
import DiffImage from "@/Stages/Diff/DiffImage";
import {CodeEditorBox} from "@/Stages/CodeEditorBox/CodeEditorBox";
import {Button} from "@/UI/Button/Button";
import {InfoModal} from "@/UI/InfoModal/InfoModal";

type StageProps = {
    stage: string;
    user?: string;
}

function calculatePixelPercentage(rank, delta) {
    if (rank <= 0) {
        return 100; // Pixel perfect at rank 0, so return 100%
    }
    if (rank >= delta) {
        return 0; // If rank exceeds or equals delta, return 0 points
    }
    // Calculate percentage based on how far away the rank is from 0
    const percentage = 100 - (rank / delta) * 100;
    //round it to 0 decimals
    return percentage.toFixed(0);
}

export default function Stage({stage, user}: StageProps) {
    const [userId, setUserId] = useState<any>(null);
    const [score, setScore] = useState<any>(0);
    // from 0 to 3
    const [stars, setStars] = useState<any>(0);
    // from 0 to 100
    const [percentage, setPercentage] = useState<any>(0);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [stages, setStages] = useState<any>([]);
    const {
        supabase,
        session,
        loadImageToCanvas,
        expectedRef,
        rank,
        width,
        height,
        setWidth,
        setHeight,
        setStage,
        stageData,
        setStageData,
        setUserData,
        worldCss,
        setShowDiff,
        showDiff,
        setLoading,
    } = useGameContext();

    const loadStages = useCallback(async (userId: string) => {
        const response = await fetch(`/stages/stages.json`);
        const stages = await response.json();

        if (userId) {
            const {data} = await supabase.from('stages')
                .select('stars, stage')
                .eq('user_id', userId)
            if (data) {
                data.forEach((stage: any) => {
                    // update stars on stages
                    const index = stages.findIndex((s: any) => s.id === stage.stage)
                    stages[index].stars = stage.stars
                })

                setStages(stages);
            }
        } else {
            setStages(stages);
        }
    }, [userId]);


    const getTitle = (stagesCompleted: number) => {
        if (stagesCompleted >= 5) {
            return 'Pixel Perfect Junior'
        } else if (stagesCompleted >= 10) {
            return 'Pixel Perfect Mid/Senior'
        } else if (stagesCompleted >= 20) {
            return 'Pixel Perfect Senior'
        } else if (stagesCompleted >= 50) {
            return 'Pixel Perfect Professional'
        } else {
            return 'Pixel Perfect Learner'
        }
    }

    const calculateProfile = async () => {
        // select and sum up all scores, stars and how many stages are completed (score==100) and return it
        // to save it on profile
        const {data, error} = await supabase.from('stages')
            .select('score, stars, stage')
            .eq('user_id', session.user.id)

        let totalScore = 0
        let totalStars = 0
        let stagesCompleted = 0
        data.forEach((stage: any) => {
            totalScore += stage.score
            totalStars += stage.stars
            if (stage.stars === 3) {
                stagesCompleted++
            }
        })
        await supabase.from('profile').upsert({
            user_id: session.user.id,
            stars: totalStars,
            score: totalScore,
            stages_completed: stagesCompleted,
            title: getTitle(stagesCompleted)
        }, {
            returning: 'minimal'
        })
    }

    const handleSave = async () => {
        setLoading(true)
        const tree = stageData.tree.map((object: any) => ({className: object.className, css: object.css}));
        const jsonCss = {
            tree,
            worldCss
        }
        const {data, error} = await supabase.from('stages').upsert({
            user_id: session.user.id,
            stage,
            css: jsonCss,
            score: rank,
            raw_score: rank,
            stars,
            percentage,
        }, {
            returning: 'minimal'
        })

        await calculateProfile()
        setLoading(false)
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
        let {data} = await supabase.from('stages').select('*').eq('user_id', userId).eq('stage', stage)
        if (data) {
            data = data[0]
            setUserData(data);
        }
        setLoading(false)
    }, [userId, stage]);

    const toggleInfoModal = () => {
        setIsInfoModalOpen(!isInfoModalOpen);
    }

    useEffect(() => {
        if (session?.user?.id) {
            setUserId(session.user.id)
            loadStages(session.user.id)
        } else {
            loadStages(userId)
        }
    }, [session]);

    useEffect(() => {
        if (user) {
            setUserId(user)
            loadStages(user)
        }
    }, [user]);

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

    useEffect(() => {
        // mas pixels delta 35215, when rank is 0 is pixel perfect 100%, if it gets away of 0, we start discounting points
        // if gets to 35215 or more, we get 0 points
        // percentage calculation
        if (rank === null || !stageData) {
            return
        }
        const result: number = parseInt(calculatePixelPercentage(rank, stageData.baseDelta) + '')
        setScore(result)
        setPercentage(result)
        if (result >= 100) {
            setStars(3)
        } else if (result >= 90) {
            setStars(2)
        } else if (result >= 80) {
            setStars(1)
        } else {
            setStars(0)
        }
        console.log('result', result)
    }, [rank, stageData]);

    if (!width || !height || !stageData) {
        return (<></>)
    }

    return (
        <div>
            <MusicLoop src={stageData.music}/>
            <div className={styles.wrapper}>

                <div className={styles.tools}>
                    <div className={styles.expectedTitle}>
                        Expected
                    </div>
                    <div ref={expectedRef} className={'expected'}>
                    </div>
                    <div className={styles.figmaWrapper}>
                        <a target={"_blank"} href={stageData.figmaLink}>
                            <img src={'/assets/figma.svg'} alt={'Figma link'}/>
                        </a>
                    </div>
                    <CodeEditorBox/>
                    <div className={styles.score}>
                        <p>
                            {score}<span>%</span>
                        </p>
                        <img src={'/assets/stage/levelup_badge_body.png'} alt={'expected'}
                             className={styles.stageBg}/>
                        <div className={styles.stars}>
                            <img src={`/assets/stage/result_star${stars > 0 ? `` : '_dim'} 1.png`} alt={'star'}/>
                            <img src={`/assets/stage/result_star${stars > 1 ? `` : '_dim'} 1.png`} alt={'star'}/>
                            <img src={`/assets/stage/result_star${stars > 2 ? `` : '_dim'} 1.png`} alt={'star'}/>
                        </div>
                    </div>
                </div>
                <div className={styles.diffImageWrapper}>
                    <div className={styles.buttons}>
                        <Button variant={'mint'} onClick={() => setShowDiff(!showDiff)}>
                            {showDiff ? 'Hide' : 'Show'} diff
                        </Button>
                        <Button variant={'mint'} onClick={toggleInfoModal}>Info</Button>
                    </div>
                    <DiffImage/>
                    <div className={styles.stagesSelectorWrapper}>
                        <div className={styles.saveWrapper}>
                            {!user && <Button onClick={handleSave} variant={'success'}>Save</Button>}
                        </div>
                        <div className={styles.stagesWrapper}>
                            <h2 className={styles.stageTitle}>Stages</h2>
                            <div className={styles.stagesContainer}>
                                {
                                    stages.map((stage: any) => (
                                        <div key={stage.id}
                                             className={styles.stageSelectorWrapper}
                                             onClick={() => setStage(stage.id)}>
                                            <div className={styles.stageStars}>
                                                <img
                                                    src={`/assets/stage/result_star${stage.stars > 0 ? `` : '_dim'} 1.png`}
                                                    alt={'star'}/>
                                                <img
                                                    src={`/assets/stage/result_star${stage.stars > 1 ? `` : '_dim'} 1.png`}
                                                    alt={'star'}/>
                                                <img
                                                    src={`/assets/stage/result_star${stage.stars > 2 ? `` : '_dim'} 1.png`}
                                                    alt={'star'}/>
                                            </div>
                                            <img className={styles.stageBg} src={`${stage.bg}`} alt={stage.id}/>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <InfoModal onClose={toggleInfoModal} isInfoModalOpen={isInfoModalOpen}>
                <h2>{stageData.info.title}</h2>
                <p dangerouslySetInnerHTML={{__html: stageData.info.description}}/>
            </InfoModal>
        </div>

    );
}
