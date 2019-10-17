import React, { } from 'react';
import { observer } from "mobx-react";
import styles from './TimeLineView.module.scss';




export interface IProps {

}

const TimeLineView: React.FC<IProps> = ({ }: IProps) => {


    return (
        <div className={styles.container}>
            <div className={styles.segment}>9:00</div>
            <div className={styles.segment}>9:30</div>
            <div className={styles.segment}>10:00</div>
            <div className={styles.segment}>10:30</div>
            <div className={styles.segment}>11:00</div>
            <div className={styles.segment}>11:30</div>
        </div >
    );
}

export default observer(TimeLineView);
