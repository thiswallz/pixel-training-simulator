'use client';
import styles from "./page.module.scss";
import Stage from "@/Stages/Stage";
import NavBar from "@/UI/NavBar/NavBar";
import {motion} from "framer-motion"
import {useGameContext} from "@/app/providers/GameContext";

export default function Home() {
    const {stage} = useGameContext();

    return (
        <div className={styles.page}>
            <NavBar/>
            <div>
                <Stage stage={stage}/>
            </div>
        </div>
    );
}
