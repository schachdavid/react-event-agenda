import React, { useRef } from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import { AgendaItem } from '../AgendaItem/AgendaItemController';
import { Item } from '../../../interfaces/modelnterfaces';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { DragItem } from '../../../interfaces/dndInterfaces'
import uuid from 'uuid';



export interface IProps {
    items: Array<Item>,
    numberOfSegments: number,
    segmentHeight: number,
    handleDropHover: (hoverClientY: number, dragItem: DragItem) => void
}

const TrackView: React.FC<IProps> = ({ items, numberOfSegments, segmentHeight, handleDropHover }: IProps) => {
    const agendaItems = items.map((item: Item) => <AgendaItem key={item.itemId} item={item}></AgendaItem>)
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

    let segments: Array<any> = [];

    for (let i: number = 0; i < numberOfSegments; i++) {
        segments.push(<div key={ uuid()} className={styles.segment} style={{ height: segmentHeight + 'px' }}></div>)
    }

    return (
        <div className={styles.container} ref={ref}>
            {segments}
            {agendaItems}
        </div>
    );
}

export default observer(TrackView);
