import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemView.module.scss';
import classNames from 'classnames';
import { IconButton } from 'office-ui-fabric-react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Customizer } from 'office-ui-fabric-react';
import { getInvertedTheme } from '../../../theme';

import { useDrag, DragSourceMonitor } from 'react-dnd'
// import { DragLayer } from 'react-dnd'






export interface IProps {
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    location?: string,
    topPx: number,
    height: number,
    small: boolean,
    hovering?: boolean,
    selected?: boolean,
    resizing?: boolean,
    dragging?: boolean,
    hideTitle?: boolean,
    hideSpeaker?: boolean,
    hideLocation?: boolean,
    editItem: () => void,
    deleteItem: () => void,
    onMouseEnter?: (e: any) => any,
    onMouseLeave?: (e: any) => any,
    onDragStart?: (e: any) => any,
    onDragEnd?: (e: any) => any,
}

const AgendaItemView: React.FC<IProps> = ({
    start,
    end,
    title,
    speaker,
    topPx,
    height,
    small,
    hovering,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDragEnd,
    editItem,
    deleteItem,
    dragging }: IProps) => {

    const [{ isDragging }, drag] = useDrag({
        item: { type: "item" },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })


    const controls = hovering ?
        <div className={classNames(styles.controls)}>
            <Stack tokens={{ childrenGap: 2 }} horizontal>
                <Customizer settings={{ theme: getInvertedTheme() }}>
                    <IconButton iconProps={{ iconName: "Edit" }} onClick={editItem} />
                    <IconButton iconProps={{ iconName: "Delete" }} onClick={deleteItem} />
                    <IconButton iconProps={{ iconName: "CircleRing" }} onClick={editItem} />
                </Customizer>
            </Stack>
        </div>
        : null;



    const resizeDots = hovering ?
        <div>
            <div className={classNames(styles.resizeDot, styles.centerAbsolute, styles.topAbsolute)} />
            <div className={classNames(styles.resizeDot, styles.centerAbsolute, styles.bottomAbsolute)} />
        </div>
        : null;





    return (
        isDragging ?
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div className={styles.shadow}/>
            </div>
            :
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div
                    ref={drag}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className={classNames(styles.main, {
                        [styles.mainHover]: hovering || dragging,
                        [styles.mainDragging]: dragging,
                    })} >

                    {!small ?
                        <div className={styles.content}>
                            <div>
                                {start} - {end}
                            </div>
                            <div className={styles.title}>
                                {title}
                            </div>
                            <div>
                                {speaker}
                            </div>
                            {/* <div>
                        Location
                    </div> */}
                            {controls}
                        </div>
                        :
                        <div className={styles.content}>
                            <div>
                                {title}
                            </div>
                            {controls}
                        </div>
                    }
                    {resizeDots}
                </div>
            </div>



    );
}



export default observer(AgendaItemView);
