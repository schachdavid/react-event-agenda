import React from 'react';
import { useDragLayer } from "react-dnd";
import styles from './AgendaItemView.module.scss';



export interface IProps {
    height: number,
    itemId: string,
    width: number,
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    small?: boolean,
}

const AgendaItemDragView: React.FC<IProps> = ({
    height,
    itemId,
    width,
    start,
    end,
    title,
    speaker,
    small }) => {

    const {
        isDragging,
        dragItem,
        currentOffset,
    } = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        dragItem: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset()
    }))

    if (!isDragging || !currentOffset || itemId !== dragItem.itemId) {
        return null
    }


    return (


        <div className={styles.container} style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'fixed',
            pointerEvents: 'none',
            top: 0,
            left: 0,
            zIndex: 200,
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
        }} >
            <div className={styles.mainDrag} >
                {!small ?
                    <div className={styles.content}>
                        <div>
                            {start} - {end}
                        </div>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <div>
                            {speaker}
                        </div>
                    </div>
                    :
                    <div className={styles.content}>
                        <div className={styles.titleSmall}>
                            {title}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}


export default AgendaItemDragView;

