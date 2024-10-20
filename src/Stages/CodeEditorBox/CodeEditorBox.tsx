import styles from "@/Stages/Stage.module.scss";
import CodeEditor from "@/UI/CodeEditor/CodeEditor";
import {useGameContext} from "@/app/providers/GameContext";


export function CodeEditorBox() {
    const {
        stageData,
        userData,
        setWorldCss,
    } = useGameContext();

    return (
        <div className={styles.editor}>
            {stageData.tree.map((object: any) => {
                return (
                    <div key={object.className}>
                        <h2>
                            {
                                object.children ? object.children.map((child: any, index: number) => {
                                    return (
                                        <img key={index} className={styles.editorObject} src={child.src}/>
                                    )
                                }) : (
                                    <img className={styles.editorObject} src={object.src}/>
                                )
                            }
                            .{object.className} Editor
                        </h2>
                        <CodeEditor
                            initialCode={userData ?
                                userData.css.tree.find((item: any) => item.className === object.className)?.css ?? object.initialCss
                                : object.initialCss}
                            identifier={'main'} onChange={
                            (css) => object.css = css
                        }/>
                    </div>
                )
            })}
            <div>
                <h2>
                    .worldWrapper Editor
                </h2>
                <CodeEditor
                    initialCode={userData?.css?.worldCss ? userData.css.worldCss : stageData.worldCss.initialCss}
                    identifier={'main'} onChange={
                    setWorldCss
                }/>
            </div>
        </div>

    )
}
