import React from 'react';
import { useDragLayer } from "react-dnd";
import styles from './AgendaItemView.module.scss';
import { useColorPaletteContext } from '../../hooks/ColorPaletteContext';
import color from 'color';



export interface IProps {
    height: number,
    id: string,
    width: number,
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    small?: boolean,

}

const AgendaItemDragView: React.FC<IProps> = ({
    height,
    id,
    width,
    start,
    end,
    title,
    speaker,
    small }) => {

    const {
        isDragging,
        dragObject,
        currentOffset,
    } = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        dragObject: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset()
    }))

    const colorPalette = useColorPaletteContext();

    if (!isDragging || !currentOffset || !dragObject) {
        return null;
    }

    const currentDraggedItemIds: Array<string> = dragObject.itemIds;
    
    if (currentDraggedItemIds  && !currentDraggedItemIds.includes(id)) return null;


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
            <div className={styles.mainDrag} style={{ backgroundColor: color(colorPalette.themePrimary).alpha(0.7).toString() }} >
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

