// basic footer
import React from 'react';
import styles from './Footer.module.scss';
import {FaDiscord} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>© 2024 Pixel Perfect Simulator</p>
                <ul>
                    <li>
                        <a target={'_blank'} href={'https://discord.gg/pmathhcZ'}> <FaDiscord/>
                            Discord Community</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
