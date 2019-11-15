import React, { useRef, useEffect } from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import { AgendaItem } from '../AgendaItem/AgendaItemController';
import { IItem } from '../../../models/ItemModel';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { DragItem } from '../../../interfaces/dndInterfaces'
import uuid from 'uuid';
import _ from 'lodash';
import { ICustomItemAction } from '../../../interfaces/agendaProps';



export interface IProps {
    items: Array<IItem>,
    numberOfSegments: number,
    segmentHeight: number,
    handleDropHover: (hoverClientY: number, dragItem: DragItem) => void,
    handleInitializeDrawUp: (initialMousePosition: number) => void,
    handleDrawUp: (initialMousePosition: number, currentMousePosition: number) => void,
    customItemActions?: Array<ICustomItemAction>
    finishDrawUp: () => void
}

const TrackView: React.FC<IProps> = ({
    items,
    numberOfSegments,
    segmentHeight,
    handleDropHover,
    handleInitializeDrawUp,
    handleDrawUp,
    finishDrawUp,
    customItemActions
}: IProps) => {
    const agendaItems = items.map((item: IItem) => <AgendaItem key={item.id} item={item} customItemActions={customItemActions}></AgendaItem>)
    const containerRef = useRef<HTMLDivElement>(null)
    const segmentsRef = useRef<HTMLDivElement>(null)


    const throttledDropHover = _.throttle(handleDropHover, 20);

    const [, drop] = useDrop({
        accept: 'item',
        hover(item: DragItem, monitor: DropTargetMonitor) {
            const hoverBoundingRect = containerRef.current!.getBoundingClientRect();
            const clientOffset = monitor.getSourceClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            throttledDropHover(hoverClientY, item);
        },
    })

    drop(containerRef);

    useEffect(() => {
        if (segmentsRef.current) {
            segmentsRef.current.addEventListener('mousedown', (evt) => initializeDrawUp(evt));
        };
    }, [])

    let initialMousePosition: number;
    const initializeDrawUp = (evt?: undefined | MouseEvent) => {
        if (evt && segmentsRef.current) {
            evt.preventDefault();
            initialMousePosition = evt.clientY - segmentsRef.current.getBoundingClientRect().top;
        }
        handleInitializeDrawUp(initialMousePosition);
        window.addEventListener('mousemove', drawUp); //TODO: throttle here
        window.addEventListener('mouseup', stopDrawUp);
    }


    const drawUp = (e: any) => {
        if (segmentsRef.current) {
            handleDrawUp(initialMousePosition, e.clientY - segmentsRef.current!.getBoundingClientRect().top)
        }
    }

    const stopDrawUp = () => {
        window.removeEventListener('mousemove', drawUp);
        window.removeEventListener('mouseup', stopDrawUp);
        finishDrawUp();
        
    }



    let segments: Array<any> = [];

    for (let i: number = 0; i < numberOfSegments; i++) {
        segments.push(<div key={uuid()} className={styles.segment} style={{ height: segmentHeight + 'px' }}></div>)
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.segmentsContainer} ref={segmentsRef}>
                {segments}
            </div>
            {agendaItems}
        </div>
    );
}

export default observer(TrackView);
