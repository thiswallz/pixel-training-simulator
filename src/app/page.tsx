'use client';
import styles from "./page.module.scss";
import {useGameContext} from "@/app/providers/GameContext";
import Stage from "@/Stages/Stage";
import {useState} from "react";
import NavBar from "@/UI/NavBar/NavBar";
import cns from 'classnames';


export default function Home() {
    const [stage, setStage] = useState('001');
    const {
        resultsRef,
        expectedRef,
        diffRef,
        showDiff
    } = useGameContext();

    return (
        <div className={styles.page}>
            <NavBar/>
            <section className={styles.mainWrapper}>
                <Stage stage={stage}/>
                <div className={'diffWrapper'}>
                    <div ref={diffRef} className={cns(styles.diff, showDiff && styles.showDiff)}>
                    </div>

                    <div ref={resultsRef} className={'results'}>
                    </div>
                </div>
            </section>
            <div>
                Stages ({stage}):
                <div>
                    <button onClick={() => setStage('001')}>001</button>
                    <button onClick={() => setStage('002')}>002</button>
                    <button onClick={() => setStage('003')}>003</button>
                </div>
                <div ref={expectedRef} className={'expected'}>
                </div>
            </div>

        </div>
    );
}
