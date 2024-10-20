import React from 'react';
import styles from './ProfileModal.module.scss';
import {motion} from "framer-motion"

const variants = {
    open: {opacity: 1, top: 0},
    closed: {opacity: 0, top: '-100%'},
}

export function ProfileModal({children, onClose, isModalOpen}: {
    children: React.ReactNode;
    onClose: () => void;
    isModalOpen: boolean
}) {
    return (
        <motion.div
            animate={isModalOpen ? "open" : "closed"}
            variants={variants} className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                <div className={styles.wrapper}>
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
