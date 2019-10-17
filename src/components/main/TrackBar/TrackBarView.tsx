import React from 'react';
import { observer } from "mobx-react";
import styles from './TrackBarView.module.scss';




export interface IProps {
}

const TrackBarView: React.FC<IProps> = ({ }: IProps) => {
    return (
        <div className={styles.container}>
            <div>
            Track 1
                </div>
        </div>
    );
}

export default observer(TrackBarView);
