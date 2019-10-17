import React from 'react';
import { observer } from "mobx-react";
import styles from './DayBarView.module.scss';
import classNames from 'classnames';




export interface IProps {
    fullWidth?: boolean
}

const DayBarView: React.FC<IProps> = ({ fullWidth }: IProps) => {
    return (
        <div className={classNames(styles.container, {
            [styles.fullWidth]: fullWidth
        })} >
            <div>Thu - Oct 25</div>
        </div>
    );
}

export default observer(DayBarView);
