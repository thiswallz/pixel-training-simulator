import styles from "@/Stages/Stage.module.scss";
import cns from "classnames";
import {useEffect, useRef, useState} from "react";
import {useGameContext} from "@/app/providers/GameContext";
import Panzoom from '@panzoom/panzoom'

export default function DiffImage() {
    const previewRef = useRef(null);
    const wrapperRef = useRef(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const {
        mainRef,
        width,
        height,
        diffRef,
        resultsRef,
        showDiff,
        stageData,
    } = useGameContext();
    const panzoom = useRef<any>(null)

    if (mainRef.current && previewRef.current) {
        const mainContent = mainRef.current.outerHTML;
        // @ts-ignore
        const previewContent = previewRef.current.firstChild ? previewRef.current.firstChild.outerHTML : '';

        if (mainContent !== previewContent) {
            const clonedElement = mainRef.current.cloneNode(true); // true means deep clone (including children)
            // @ts-ignore
            previewRef.current.innerHTML = ''; // Clear any existing content
            // @ts-ignore
            previewRef.current.appendChild(clonedElement);
        }
    }

    useEffect(() => {
        if (panzoom.current) {
            panzoom.current.reset()
            panzoom.current.zoom(1, {animate: true})
        }

    }, [stageData]);

    const resizeImage = () => {
        const viewportWidth = window.innerWidth - 360;
        const newScaleFactor = viewportWidth < width ? viewportWidth / width : 1;
        setScaleFactor(newScaleFactor);
    };

    useEffect(() => {
        if (!width) {
            return;
        }
        resizeImage();
        window.addEventListener('resize', resizeImage);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('resize', resizeImage);
    }, [width]);


    useEffect(() => {
        if (wrapperRef.current) {
            const elem = wrapperRef.current!
            panzoom.current = Panzoom(elem, {
                maxScale: 60,
                minScale: 1,
                startY: 0,
                startX: 0,
                contain: 'outside',
                panOnlyWhenZoomed: true,
            })
            panzoom.current.pan(0, 0)
            panzoom.current.reset()
            panzoom.current.zoom(1, {animate: true})
            elem.parentElement!.addEventListener('wheel', panzoom.current.zoomWithWheel)
        }
    }, [wrapperRef]);
    return (
        <div style={{
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
            <div className={styles.previewWrapper}
            >
                <div ref={wrapperRef} style={{overflow: 'hidden'}} className={styles.wrapperRef}>
                    <section ref={previewRef} className={styles.preview}
                             style={{
                                 width: `${width}px`,
                                 height: `${height}px`,
                                 transform: `scale(${scaleFactor})`,
                                 transformOrigin: '0 0',
                             }}>
                    </section>
                    <div ref={diffRef} className={cns(styles.diff, showDiff && styles.showDiff)}
                         style={{
                             width: `${width}px`,
                             height: `${height}px`,
                             transform: `scale(${scaleFactor})`,
                             transformOrigin: '0 0',
                         }}>
                    </div>
                </div>

            </div>
            <div className={styles.mainWrapper} style={{opacity: '0'}}>

                <main ref={mainRef} id={'main'} style={{
                    width: `${width}px`,
                    height: `${height}px`,
                }}>
                    <section className={'worldWrapper'}>
                        {stageData.tree.map((object: any) => {
                            if (object.src) {
                                object.repeat = object.repeat || 1;
                                return Array.from({length: object.repeat}).map((_, j) => {
                                    return (
                                        <img key={object.className} className={object.className}
                                             src={object.src}/>
                                    )
                                })
                            } else {
                                return (
                                    <div key={object.className} className={object.className}>
                                        {
                                            object.children.map((child: any, index: number) => {
                                                child.repeat = child.repeat || 1;
                                                return Array.from({length: child.repeat}).map((_, j) => {
                                                        return (
                                                            <img key={`${child.className}-${index}-${j}`}
                                                                 className={child.className}
                                                                 src={child.src}/>
                                                        )
                                                    }
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }
                        })}
                    </section>
                    {stageData.base &&
                        <img className={stageData.base.className} src={stageData.base.src}/>}

                </main>
                <div className={'diffWrapper'}>

                    <div ref={resultsRef} className={'results'}>
                    </div>
                </div>
            </div>

        </div>

    )

}
