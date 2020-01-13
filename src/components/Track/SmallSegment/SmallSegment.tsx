import React from 'react';
import { observer } from "mobx-react";
import styles from './SmallSegment.module.scss';
import uuid from 'uuid';
import classNames from 'classnames';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


export interface IProps {
    enableHover: boolean,
    height: number,
    showBorderBottom: boolean,
}

const SmallSegment: React.FC<IProps> = ({
    enableHover,
    height,
    showBorderBottom
}: IProps) => {

    return (
        <div
            key={uuid()}
            className={classNames(styles.smallSegment)}
            style={{
                height: height + 'px',
                borderBottom: showBorderBottom ? '1px dashed var(--neutralQuaternary)' : ''
            }}>
            {enableHover ?
                <>
                    <Icon iconName="ChevronUp" className={classNames(styles.chevronIcon, styles.chevronIconTop)} />
                    <div className={styles.smallSegmentHoverContainer}>
                        <div className={styles.smallSegmentText}><Icon iconName="AddTo" className={styles.addIcon} />Create new agenda item</div>
                    </div>
                    <Icon iconName="ChevronDown" className={classNames(styles.chevronIcon, styles.chevronIconBottom)} />
                </>
                : null}
        </div>
    );
}

export default observer(SmallSegment);
