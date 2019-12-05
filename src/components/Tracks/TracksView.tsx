import React, { useCallback } from 'react';
import { observer } from "mobx-react";
import styles from './TracksView.module.scss';
import { Track } from '../Track/TrackController';
import classNames from 'classnames';
import { DayBar } from '../DayBar/DayBarController';
import { TrackBar } from '../TrackBar/TrackBarController';
import { ITrack as TrackData, IDay } from '../../models/AgendaStore';
import { TimeLine } from '../TimeLine/TimeLineController';
import { ICustomItemAction } from '../../interfaces/agendaProps';
import { Moment } from 'moment';
import { DragObject } from '../../interfaces/dndInterfaces';
import { Stack, IconButton, IIconProps, IButtonStyles } from 'office-ui-fabric-react';
import { useColorPaletteContext } from '../../hooks/ColorPaletteContext';



export interface IProps {
    handleWidthChange: (newWidth: number) => void;
    width: number;
    days: Array<IDay>;
    singleTracks: boolean;
    customItemActions?: Array<ICustomItemAction>,
    moveDragObject: (trackId: string, newStart: Moment, dragObject: DragObject) => void,
    paginateRight: () => void,
    paginateLeft: () => void
}

const TracksView: React.FC<IProps> = ({
    days,
    handleWidthChange,
    width,
    moveDragObject,
    singleTracks,
    customItemActions,
    paginateRight,
    paginateLeft }: IProps) => {

    const palette = useColorPaletteContext();

    const refTracksContainer = useCallback(node => {
        if (node !== null) {
            handleWidthChange(node.clientWidth - 1);
            const handleResize = () => {
                if (node.clientWidth !== width) {
                    handleWidthChange(node.clientWidth);
                }
            }
            window.addEventListener('resize', handleResize);
            return () => { window.removeEventListener('resize', handleResize) };
        }
        return;
    }, []);

    // handleWidthChange(width);


    let trackViews;
    let dayBarViews;
    let trackBarViews;

    if (singleTracks) {
        const tracks: Array<TrackData> = days.map((day: IDay) => { return day.tracks[0] })
        dayBarViews = days.map((day) => {
            return <DayBar key={day.id} day={day}> </DayBar>
        });

        trackViews = tracks.map((track: TrackData) => {
            return <Track key={track.id} track={track} customItemActions={customItemActions} moveDragObject={moveDragObject}></Track>
        });
    } else {
        const tracks: Array<TrackData> = days[0].tracks;
        trackBarViews = tracks.map((track: TrackData) => {
            return <TrackBar key={track.id}></TrackBar>
        });
    }


    const leftArrowIcon: IIconProps = { iconName: 'ChevronLeft', };
    const rightArrowIcon: IIconProps = { iconName: 'ChevronRight' };

    const arrowStyles: IButtonStyles = {
        root: {
            height: '43px',
            width: '24px'
        },
        icon: {
            color: palette.neutralPrimary,
            fontSize: '14px'
        }
    }




    return (
        <div className={styles.container}>
            {dayBarViews ?
                <div className={styles.flex}>
                    <div className={classNames(styles.barPlaceHolderFront, styles.borderBottom)}>
                        <Stack tokens={{ childrenGap: 0 }} horizontal>
                            <IconButton
                                styles={arrowStyles}
                                iconProps={leftArrowIcon}
                                title="Paginate Days Left"
                                ariaLabel="Paginate Days Left"
                                disabled={false} 
                                onClick={paginateLeft}
                                />
                            <IconButton
                                styles={arrowStyles}
                                iconProps={rightArrowIcon}
                                title="Paginate Days Right"
                                ariaLabel="Paginate Days Right"
                                disabled={false}
                                onClick={paginateRight}
                            />
                        </Stack>
                    </div>
                    <div className={classNames(styles.flex, styles.borderBottom)} style={{ width: width }}>
                        {dayBarViews}
                    </div>
                    <div className={classNames(styles.barPlaceHolderEnd, styles.borderBottom)}></div>
                </div>
                : null}

            <div className={styles.tracksContainer} >
                <TimeLine />
                <div className={styles.flex} ref={refTracksContainer}>
                    {trackViews}
                </div>
                {/* <div style={{position: 'fixed', bottom: 0, left: 0, width:'100%'}} onDragEnter={document.scroll}>

                </div> */}
            </div>

            {trackBarViews ?
                <div className={styles.flex}>
                    <div className={classNames(styles.barPlaceHolderFront, styles.borderTop)}></div>
                    <div className={styles.flex} style={{ width: width }}>
                        {trackBarViews}
                    </div>
                    <div className={classNames(styles.barPlaceHolderEnd, styles.borderTop)}></div>
                </div>
                : null}
        </div >
    );
}


export default observer(TracksView);
