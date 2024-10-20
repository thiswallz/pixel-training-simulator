'use client';
import {useGameContext} from "@/app/providers/GameContext";
import styles from "@/app/page.module.scss";
import NavBar from "@/UI/NavBar/NavBar";
import Stage from "@/Stages/Stage";

export default function Page({params}: { params: { slug: string } }) {
    const {stage} = useGameContext();

    return (
        <div className={styles.page}>
            <NavBar/>
            <div className={styles.stage}>
                <Stage stage={stage} user={params.slug}/>
            </div>

        </div>
    )
}
