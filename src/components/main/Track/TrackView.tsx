import React from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import AgendaItemController from '../AgendaItem/AgendaItemController';
import AgendaItemView from '../AgendaItem/AgendaItemView';



export interface IProps {
}

const TrackView: React.FC<IProps> = ({ }: IProps) => {
    const agendaItems = <AgendaItemController>
        {({ topPx, height, editing, hovering, onMouseEnter, onMouseLeave, onDragStart, onDragEnd, dragging, setEditing }) =>
            <AgendaItemView
                topPx={topPx}
                height={height}
                editing={editing}
                hovering={hovering}
                dragging={dragging}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                setEditing={setEditing}
            />}
    </AgendaItemController>

    return (
        <div className={styles.container}>
                <div className={styles.segment}></div>
                <div className={styles.segment}></div>
                <div className={styles.segment}></div>
                <div className={styles.segment}></div>
                <div className={styles.segment}></div>
                <div className={styles.segment}></div>
                {agendaItems}


            {/* <div className={styles.trackBar}>
            </div> */}
        </div>
    );
}

export default observer(TrackView);
