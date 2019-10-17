import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemView.module.scss';
import classNames from 'classnames';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import AgendaItemEditController from './AgendaItemEdit/AgendaItemEditController';
import AgendaItemEditView from './AgendaItemEdit/AgendaItemEditView';



export interface IProps {
    topPx: number,
    height: number,
    editing?: boolean,
    hovering?: boolean,
    selected?: boolean,
    resizing?: boolean,
    dragging?: boolean,
    title?: string,
    hideTitle?: boolean,
    speaker?: string,
    hideSpeaker?: boolean,
    location?: string,
    hideLocation?: boolean,
    setEditing: (editing: boolean) => void, 
    onMouseEnter?: (e: any) => any,
    onMouseLeave?: (e: any) => any,
    onDragStart?: (e: any) => any,
    onDragEnd?: (e: any) => any,
}

const AgendaItemView: React.FC<IProps> = ({
    topPx,
    height,
    editing,
    hovering,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDragEnd,
    setEditing,
    dragging }: IProps) => {



    const resizeDots = hovering ?
        <div>
            <div className={classNames(styles.resizeDot, styles.centerAbsolute, styles.topAbsolute)} />
            <div className={classNames(styles.resizeDot, styles.centerAbsolute, styles.bottomAbsolute)} />
        </div>
        : null;

    const controls = hovering ?
        <div className={classNames(styles.controls)}>
            <Stack tokens={{ childrenGap: 12 }} horizontal>
                <Icon iconName="Edit" className="ms-IconExample" onClick={() => setEditing(true)}/>
                <Icon iconName="Delete" className="ms-IconExample" />
                <Icon iconName="CircleRing" className="ms-IconExample" />
            </Stack>
        </div>
        : null;




    return (
        !editing ?
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className={classNames(styles.main, {
                        [styles.mainHover]: hovering || dragging,
                        [styles.mainDragging]: dragging,
                    })} draggable={true} >
                    <div className={styles.content}>
                        <div>
                            10:05 - 10:20
                    </div>
                        <div className={styles.title}>
                            Title
                    </div>
                        <div>
                            Speaker
                    </div>
                        {/* <div>
                        Location
                    </div> */}
                    </div>
                    {controls}
                    {resizeDots}
                </div>
            </div>
            : <AgendaItemEditController topPx={topPx} height={height}>
                {({ topPx, height}) => <AgendaItemEditView topPx={topPx} height={height} />}
            </AgendaItemEditController>
    );
}

export default observer(AgendaItemView);
