import React from 'react';
import { observer } from "mobx-react";
import styles from './DayBarView.module.scss';
import classNames from 'classnames';




export interface IProps {
    fullWidth?: boolean,
    dayName: string

}

const DayBarView: React.FC<IProps> = ({ dayName, fullWidth }: IProps) => {
    return (
        <div className={classNames(styles.container, {
            [styles.fullWidth]: fullWidth
        })} >
            <div>{dayName}</div>
        </div>
    );
}

export default observer(DayBarView);
