import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemView.module.scss';
import classNames from 'classnames';
import { IconButton } from 'office-ui-fabric-react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Customizer } from 'office-ui-fabric-react';
import { getInvertedTheme, getRGBPalette } from '../../../theme';
import Color from 'color';


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
    dragging: boolean,
    dragRef: any,
    // resizeEndRef: any,
    hideTitle?: boolean,
    hideSpeaker?: boolean,
    hideLocation?: boolean,
    initResizing: () => void,
    handleResizeEndTime: (diff: number) => void,
    finishResizeEndTime: () => void,
    handleResizeStartTime: (diff: number) => void,
    finishResizeStartTime: () => void,
    editItem: () => void,
    deleteItem: () => void,
    onMouseEnter?: (e: any) => any,
    onMouseLeave?: (e: any) => any,
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
    initResizing,
    handleResizeEndTime,
    finishResizeEndTime,
    handleResizeStartTime,
    finishResizeStartTime,
    editItem,
    deleteItem,
    dragging,
    dragRef,
    resizing
}: IProps) => {


    enum Direction {
        Start,
        End
    }

    let initialMousePosition: number;
    let currentDirection: Direction;
    const initializeResizing = (direction: Direction, e?: undefined | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        currentDirection = direction;
        initResizing();
        if (e) {
            e.preventDefault();
            initialMousePosition = e.clientY;
        }
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    const resize = (e: any) => {
        let diff: number = e.clientY - initialMousePosition;
        if (Direction.End === currentDirection) handleResizeEndTime(diff);
        else if (Direction.Start === currentDirection) handleResizeStartTime(diff);
    }

    const stopResize = () => {
        window.removeEventListener('mousemove', resize); //TODO: throttle here
        window.removeEventListener('mouseup', stopResize);
        if (Direction.End === currentDirection) finishResizeEndTime();
        else if (Direction.Start === currentDirection) finishResizeStartTime();
    }

    const hoverColor = Color(getRGBPalette().themePrimary).darken(0.06).string();




    const controls = hovering && !resizing ?
        <div className={styles.controls} style={{ backgroundColor: hoverColor }}>
            <Stack tokens={{ childrenGap: 2 }} horizontal>
                <Customizer settings={{ theme: getInvertedTheme() }}>
                    <IconButton iconProps={{ iconName: "Edit" }} onClick={editItem} />
                    <IconButton iconProps={{ iconName: "Delete" }} onClick={deleteItem} />
                    {/* <IconButton iconProps={{ iconName: "CircleRing" }} onClick={editItem} /> */}
                </Customizer>
            </Stack>
        </div>
        : null;



    const resizeDots = hovering || resizing ?
        <div onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* <div className={styles.resizeDotTopContainer} onMouseDown={
                (e?: undefined | React.MouseEvent<HTMLDivElement, MouseEvent>) => initializeResizing(Direction.Start, e)}>
                <div className={styles.resizeDot}  style={{borderColor: hoverColor}}/>
            </div> */}
            {/* <div className={styles.resizeDotBottomContainer} onMouseDown={
                (e?: undefined | React.MouseEvent<HTMLDivElement, MouseEvent>) => initializeResizing(Direction.End, e)}>
                <div className={styles.resizeDot} style={{borderColor: hoverColor}}/>
            </div> */}

            <div className={styles.resizeHandleBarContainer} onMouseDown={
                (e?: undefined | React.MouseEvent<HTMLDivElement, MouseEvent>) => initializeResizing(Direction.End, e)}>
                <div className={styles.resizeHandleBar} >
                    <div className={styles.resizeHandleBarLine} />
                    <div className={styles.resizeHandleBarLine} />
                </div>
            </div>
        </div>
        : null;





    return (
        dragging ?
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div className={styles.shadow} />
            </div>
            :
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div
                    ref={dragRef}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={editItem}
                    style={hovering ? { backgroundColor: hoverColor } : {}}
                    className={classNames(styles.main, {
                        [styles.mainHover]: hovering || resizing,
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
                            <div className={styles.titleSmall}>
                                {title}
                            </div>
                            {controls}
                        </div>
                    }
                </div>
                {resizeDots}
            </div>



    );
}



export default observer(AgendaItemView);
