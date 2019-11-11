import React from 'react';
import { observer } from "mobx-react";
import styles from './SampleView.module.scss';




export interface IProps {
}

const SampleView: React.FC<IProps> = ({ }: IProps) => {
    return (
        <div className={styles.container}>
        </div>
    );
}

export default observer(SampleView);
