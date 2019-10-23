import React from 'react';
import { useDragLayer } from "react-dnd";
import styles from './AgendaItemView.module.scss';



export interface IProps {
    height: number,
    topPx: number,
    itemId: string,
}

const AgendaItemDragShadowView: React.FC<IProps> = ({
    height,
    topPx,
    itemId,
}) => {

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
        <div className={styles.container} style={{ top: topPx, height: height }} >
            <div className={styles.shadow} />
        </div>
    )
}


export default AgendaItemDragShadowView;

