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

    // const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            // onMouseEnter={() => { if (enableHover) { setIsHovering(true) } }}
            // onMouseLeave={() => { setIsHovering(false) } }
            key={uuid()}
            className={classNames(styles.smallSegment)}
            style={{
                height: height + 'px',
                borderBottom: showBorderBottom ? '1px dashed var(--neutralQuaternary)' : ''
            }}>
            {enableHover ?
                <div
                    // style={{visibility: enableHover && isHovering ? "visible" : "hidden"}}
                    className={styles.smallSegmentHoverContainer}
                >
                    < Icon iconName="ChevronUp" className={styles.chevronIcon} />
                    <div className={styles.smallSegmentText}><Icon iconName="AddTo" className={styles.addIcon} />Create new agenda item</div>
                    <Icon iconName="ChevronDown" className={styles.chevronIcon} />
                </div> : null
            }

        </div>
    );
}

export default observer(SmallSegment);
