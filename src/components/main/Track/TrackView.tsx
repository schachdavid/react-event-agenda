import React from 'react';
import { observer } from "mobx-react";
import styles from './TrackView.module.scss';
import { AgendaItem } from '../AgendaItem/AgendaItemController';
import { Item } from '../../../types/types';



export interface IProps {
    items: Array<Item>,
    numberOfSegments: number,
    segmentHeight: number,
}

const TrackView: React.FC<IProps> = ({ items, numberOfSegments, segmentHeight }: IProps) => {
    const agendaItems = items.map((item: Item) => <AgendaItem item={item}></AgendaItem>)

    let segments: Array<any> = [];
    
    for(let i: number = 0; i<numberOfSegments; i++){
        segments.push(<div className={styles.segment} style={{height: segmentHeight + 'px'}}></div>)
    }
   
    return (
        <div className={styles.container}>
            {segments}
            {agendaItems}
        </div>
    );
}

export default observer(TrackView);
