import {useGameContext} from "@/app/providers/GameContext";

export default function NavBar() {

    const {showDiff, setShowDiff} = useGameContext();

    return (
        <nav>
            <button onClick={() => setShowDiff(!showDiff)}>
                {showDiff ? 'Hide' : 'Show'} diff
            </button>
        </nav>
    )
}
