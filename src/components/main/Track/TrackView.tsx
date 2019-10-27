import React, { useRef } from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import { AgendaItem } from '../AgendaItem/AgendaItemController';
import { IItem } from '../../../models/ItemModel';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { DragItem } from '../../../interfaces/dndInterfaces'
import uuid from 'uuid';



export interface IProps {
    items: Array<IItem>,
    numberOfSegments: number,
    segmentHeight: number,
    handleDropHover: (hoverClientY: number, dragItem: DragItem) => void,
    // handleInitializeDrawUp: () => void,
    // handleDrawUp: (initialMousePosition: number, currentMousePosition: number) => void
}

const TrackView: React.FC<IProps> = ({
    items,
    numberOfSegments,
    segmentHeight,
    handleDropHover,
    // handleInitializeDrawUp,
    // handleDrawUp 
}: IProps) => {
    const agendaItems = items.map((item: IItem) => <AgendaItem key={item.id} item={item}></AgendaItem>)
    const ref = useRef<HTMLDivElement>(null)


    
    const [, drop] = useDrop({
        accept: 'item',
        hover(item: DragItem, monitor: DropTargetMonitor) {
            const hoverBoundingRect = ref.current!.getBoundingClientRect();
            const clientOffset = monitor.getSourceClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            handleDropHover(hoverClientY, item);
        },
    })

    drop(ref);

    // useEffect(() => {
    //     if (ref.current) {
    //         ref.current.addEventListener('mousedown', (evt) => initializeDrawUp(evt));
    //     };
    // }, [])

    // let initialMousePosition: number;
    // const initializeDrawUp = (evt?: undefined | MouseEvent) => {
    //     if (evt) {
    //         evt.preventDefault();
    //         initialMousePosition = evt.clientY;
    //     }
    //     handleInitializeDrawUp();
    //     window.addEventListener('mousemove', drawUp);
    //     window.addEventListener('mouseup', stopDrawUp);
    // }

    // console.log(initializeDrawUp);

    // const drawUp = (e: any) => {
    //     handleDrawUp(initialMousePosition, e.clientY)
    // }

    // const stopDrawUp = () => {
    //     window.removeEventListener('mousemove', drawUp);
    //     window.removeEventListener('mouseup', stopDrawUp);
    // }



    let segments: Array<any> = [];

    for (let i: number = 0; i < numberOfSegments; i++) {
        segments.push(<div key={uuid()} className={styles.segment} style={{ height: segmentHeight + 'px' }}></div>)
    }

    return (
        <div className={styles.container} ref={ref}>
            {segments}
            {agendaItems}
        </div>
    );
}

export default observer(TrackView);
