import React, { } from 'react';
import { observer } from "mobx-react";
import styles from './TimeLineView.module.scss';




export interface IProps {
    timeLabels: Array<string>,
    segmentHeight: number,

}

const TimeLineView: React.FC<IProps> = ({ timeLabels, segmentHeight }: IProps) => {

    let segments: Array<any> = timeLabels.map((label: string) =>
        <div className={styles.segment} style={{ height: segmentHeight + 'px' }}>
            {label}
        </div>);

    return (
        <div className={styles.container}>
            {segments}
        </div >
    );
}

export default observer(TimeLineView);
