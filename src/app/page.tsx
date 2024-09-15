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
            <motion.div key={stage}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                        exit={{opacity: 0}}>

                <Stage stage={stage}/>
            </motion.div>
        </div>
    );
}
