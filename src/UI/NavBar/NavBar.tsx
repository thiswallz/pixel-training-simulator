import styles from "./NavBar.module.scss";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {useGameContext} from "@/app/providers/GameContext";
import {Button} from "@/UI/Button/Button";
import {ProfileModal} from "@/UI/ProfileModal/ProfileModal";
import {useEffect, useState} from "react";
import {toast} from 'react-toastify';

export default function NavBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    const {
        supabase,
        session,
    } = useGameContext();

    const loadProfile = async () => {
        if (session) {
            const {data, error} = await supabase
                .from('profile')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
            if (error) {
                console.error('error', error.message);
            } else {
                setProfile(data);
            }
        }
    }

    const handleShare = async () => {
        // generate url to share, like : /share/40be3f1c-bf35-4ca6-b217-c8c8130c7263 on clipboard
        const shareUrl = `${window.location.origin}/share/${session.user.id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
    }

    useEffect(
        () => {
            loadProfile();
        },
        [session]
    )
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <img src={'/logo.gif'} alt={'logo'}/>
            </div>
            <div>
                <h1 className={styles.title}>Fun Pixel Perfect Simulator</h1>
                <h2 className={styles.subTitle}>Training and Screening for Pixel Perfect Professionals (Figma to
                    UI)</h2>
            </div>
            <div className={styles.toolbar}>
                <div>
                    {
                        !session ? (
                            <Auth view={'sign_in'} providers={['github']} supabaseClient={supabase}
                                  appearance={{theme: ThemeSupa}}/>
                        ) : (
                            <div className={styles.userWrapper}>
                                <Button onClick={handleShare}>
                                    Share
                                </Button>
                                <Button onClick={() => supabase.auth.signOut()}>
                                    Sign Out
                                </Button>
                                <a className={styles.profile} onClick={() => setIsModalOpen(true)}>
                                    <img src={session.user?.user_metadata.avatar_url} alt={session.user?.email}/>
                                </a>
                            </div>
                        )
                    }
                </div>
            </div>

            <ProfileModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>My Profile</h2>
                <p>
                    Title: <span style={{color: 'yellow'}}>{profile?.title}</span>
                </p>
                <p className={styles.profileStars}>
                    Stars: <span>
                    {profile?.stars} <img src={'/assets/stage/result_star 1.png'} alt={'star'}/>
                </span>
                </p>
                <p>
                    Stages Completed: <span>{profile?.stages_completed}</span>
                </p>
                <p>
                    Score: <span>{profile?.score}</span>
                </p>
            </ProfileModal>
        </nav>
    )
}
