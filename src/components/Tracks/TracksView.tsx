import React, { useCallback, useState } from 'react';
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



export interface IProps {
    handleWidthChange: (newWidth: number) => void;
    days: Array<IDay>;
    singleTracks: boolean;
    customItemActions?: Array<ICustomItemAction>,
    moveDragObject: (trackId: string, newStart: Moment, dragObject: DragObject) => void


}

const TracksView: React.FC<IProps> = ({ days, handleWidthChange, moveDragObject, singleTracks, customItemActions }: IProps) => {

    const [width, setWidth] = useState(0);

    const refTracksContainer = useCallback(node => {
        if (node !== null) {
            setWidth(node.clientWidth - 1);
            handleWidthChange(node.clientWidth - 1);

            const handleResize = () => {
                if (node.clientWidth != width) {
                    setWidth(node.clientWidth);
                    handleWidthChange(node.clientWidth)
                }
            }

            window.addEventListener('resize', handleResize);
            return () => { window.removeEventListener('resize', handleResize) };
        }
        return;
    }, []);


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



    return (
        <div className={styles.container}>
            {dayBarViews ?
                <div className={styles.flex}>
                    <div className={classNames(styles.barPlaceHolderFront, styles.borderBottom)}></div>
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
