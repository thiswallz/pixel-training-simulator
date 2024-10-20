'use client';
import styles from "./page.module.scss";
import Stage from "@/Stages/Stage";
import NavBar from "@/UI/NavBar/NavBar";
import {motion} from "framer-motion"
import {useGameContext} from "@/app/providers/GameContext";
import Footer from "@/UI/Footer/Footer";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const variants = {
    open: {opacity: 1},
    closed: {opacity: 0, top: '-100%'},
}

export default function Home() {
    const {stage, loading} = useGameContext();

    return (
        <div className={styles.page}>
            <NavBar/>
            <div className={styles.stage}>
                <Stage stage={stage}/>
            </div>
            <motion.div
                animate={loading ? "open" : "closed"}
                variants={variants} className={styles.loading}>
                <div className={styles.loadingText}>
                    <p>LOADING...</p>
                    <img src={'/assets/stage/game_background_2.png'} alt={'loading'}/>
                </div>
            </motion.div>
            {loading && (<motion.div animate={loading ? "open" : "closed"}
                                     variants={variants}>
                <div className={styles.backdrop}>
                </div>
            </motion.div>)}
            <Footer/>
            <ToastContainer theme={'dark'} position={'bottom-right'}/>
        </div>
    );
}
