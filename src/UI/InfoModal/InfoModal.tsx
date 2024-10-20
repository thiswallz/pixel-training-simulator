import React from 'react';
import styles from './InfoModal.module.scss';
import {motion} from "framer-motion"

const variants = {
    open: {opacity: 1, top: 0},
    closed: {opacity: 0, top: '-100%'},
}

export function InfoModal({children, onClose, isInfoModalOpen}: {
    children: React.ReactNode;
    onClose: () => void;
    isInfoModalOpen: boolean
}) {
    return (
        <motion.div
            animate={isInfoModalOpen ? "open" : "closed"}
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
