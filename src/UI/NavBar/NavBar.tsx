import styles from "./NavBar.module.scss";

export default function NavBar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <img src={'/logo.gif'} alt={'logo'}/>
            </div>
            <div>
                <h1 className={styles.title}>Fun Pixel Perfect Simulator</h1>
                <h2 className={styles.subTitle}>Training and Screening for Frontend Professionals</h2>
            </div>

        </nav>
    )
}
