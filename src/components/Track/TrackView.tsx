import React, { useRef } from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import { AgendaItem } from '../AgendaItem/AgendaItemController';
import { IItem } from '../../models/ItemModel';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { DragObject } from '../../interfaces/dndInterfaces'
import uuid from 'uuid';
import throttle from 'lodash/throttle';
import { ICustomItemAction } from '../../interfaces/agendaProps';
// import SmallSegment from './SmallSegment/SmallSegment';
import classNames from 'classnames';
import { Icon } from 'office-ui-fabric-react';



export interface IProps {
    items: Array<IItem>,
    numberOfSegments: number,
    numberOfSmallSegments: number,
    smallSegmentHeight: number,
    handleDropHover: (hoverClientY: number, dragObject: DragObject) => void,
    handleInitializeDrawUp: (initialMousePosition: number) => void,
    handleDrawUp: (initialMousePosition: number, currentMousePosition: number) => void,
    customItemActions?: Array<ICustomItemAction>,
    finishDrawUp: () => void,
    enableHover: boolean,
    refScrollContainer: React.RefObject<HTMLDivElement>
}

const TrackView: React.FC<IProps> = ({
    items,
    numberOfSegments,
    numberOfSmallSegments,
    smallSegmentHeight,
    handleDropHover,
    handleInitializeDrawUp,
    handleDrawUp,
    finishDrawUp,
    customItemActions,
    enableHover,
}: IProps) => {
    const agendaItems = items.map((item: IItem) => <AgendaItem key={item.id} item={item} customItemActions={customItemActions}></AgendaItem>)
    const containerRef = useRef<HTMLDivElement>(null)
    const segmentsRef = useRef<HTMLDivElement>(null)


    const throttledDropHover = throttle(handleDropHover, 20);

    const [, drop] = useDrop({
        accept: 'item',
        hover(dragObject: DragObject, monitor: DropTargetMonitor) {
            const hoverBoundingRect = containerRef.current!.getBoundingClientRect();
            const sourceClientOffset = monitor.getSourceClientOffset();
            const hoverClientY = (sourceClientOffset as XYCoord).y - hoverBoundingRect.top;
            throttledDropHover(hoverClientY, dragObject);
        },
    })

    drop(containerRef);

    let initialMousePosition: number;
    const initializeDrawUp = (event: any) => {
        if (!enableHover) return;
        if (event && segmentsRef.current) {
            if (event.buttons !== 1) return;
            event.preventDefault();
            initialMousePosition = event.clientY - segmentsRef.current.getBoundingClientRect().top;
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


    let smallSegments: Array<JSX.Element> = [];

    for (let i: number = 0; i < numberOfSmallSegments; i++) {
        smallSegments.push(
            // <SmallSegment
            //     enableHover={enableHover}
            //     height={smallSegmentHeight}
            //     showBorderBottom={i === numberOfSmallSegments - 1}
            // />
            <div key={uuid()}
                className={classNames(styles.smallSegment)}
                style={{
                    height: smallSegmentHeight + 'px',
                    borderBottom: i == numberOfSmallSegments - 1 ? '1px dashed var(--neutralQuaternary)' : ''
                }}>
                {enableHover ?
                    <div className={styles.smallSegmentHoverContainer}>
                        <Icon iconName="ChevronUp" className={styles.chevronIcon} />
                        <div className={styles.smallSegmentText}><Icon iconName="AddTo" className={styles.addIcon} />Create new agenda item</div>
                        <Icon iconName="ChevronDown" className={styles.chevronIcon} />
                    </div>

                    : null}
            </div>
            )
    }

    let segments: Array<JSX.Element> = [];

    for (let i: number = 0; i < numberOfSegments; i++) {
        segments.push(<div key={uuid()} className={styles.segment}>
            {smallSegments}
        </div>)
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.segmentsContainer} onMouseDown={initializeDrawUp} ref={segmentsRef}>
                {segments}
            </div>
            {agendaItems}
        </div>
    );
}

export default observer(TrackView);
