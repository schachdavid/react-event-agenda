import React from 'react';
import { observer } from "mobx-react";
import styles from './DaysView.module.scss';

import TracksController from '../Tracks/TracksController';
import TracksView from '../Tracks/TracksView';
import DayBarController from '../DayBar/DayBarController';
import DayBarView from '../DayBar/DayBarView';




export interface IProps {
    days: Array<string>
}

const DaysView: React.FC<IProps> = ({ days }: IProps) => {

    const daysViewNoTracks = days.map(() => {
        return <div>
            <DayBarController>
                {() => <DayBarView />}
            </DayBarController>
            <TracksController>
                {({ tracks, handleWidthChange }) => <TracksView tracks={tracks} handleWidthChange={handleWidthChange} />}
            </TracksController>
        </div>

    });

    return (
        <div className={styles.container}>
            {daysViewNoTracks}
        </div>
    );
}

export default observer(DaysView);
