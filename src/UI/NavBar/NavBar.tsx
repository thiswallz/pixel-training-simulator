import styles from "./NavBar.module.scss";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {useGameContext} from "@/app/providers/GameContext";

export default function NavBar() {
    const {
        supabase,
        session,
    } = useGameContext();
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <img src={'/logo.gif'} alt={'logo'}/>
            </div>
            <div>
                <h1 className={styles.title}>Fun Pixel Perfect Simulator</h1>
                <h2 className={styles.subTitle}>Training and Screening for Frontend Professionals</h2>
            </div>
            <div>
                <div className={styles.toolbar}>
                    {
                        !session ? (
                            <Auth view={'sign_in'} providers={['github']} supabaseClient={supabase}
                                  appearance={{theme: ThemeSupa}}/>
                        ) : (
                            <div className={styles.userWrapper}>
                                <img src={session.user?.user_metadata.avatar_url} alt={session.user?.email}/>
                                <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
                                <button onClick={() => supabase.auth.signOut()}>Share</button>
                            </div>
                        )
                    }
                </div>
            </div>

        </nav>
    )
}
