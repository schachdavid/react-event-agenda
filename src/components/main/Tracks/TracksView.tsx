import React, { useCallback, useState } from 'react';
import { observer } from "mobx-react";
import styles from './TracksView.module.scss';
import TrackController from '../Track/TrackController';
import TrackView from '../Track/TrackView';
import TrackBarController from '../TrackBar/TrackBarController';
import TrackBarView from '../TrackBar/TrackBarView';
import DayBarController from '../DayBar/DayBarController';
import DayBarView from '../DayBar/DayBarView';
import TimeLineView from '../../TimeLine/TimeLineView';
import classNames from 'classnames';



export interface IProps {
    tracks: Array<string>;
    handleWidthChange: (newWidth: number) => void;
    singleTrack?: boolean;
    days?: Array<string>;
}

const TracksView: React.FC<IProps> = ({ tracks, handleWidthChange, singleTrack }: IProps) => {

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





    const trackViews =
        tracks.map(() => {
            return <TrackController>
                {() => <TrackView />}
            </TrackController>
        });



    const dayBarViews =
        tracks.map(() => {
            return <DayBarController >
                {() => <DayBarView />}
            </DayBarController>

        });


    const trackBarViews =
        tracks.map(() => {
            return <TrackBarController>
                {() => <TrackBarView />}
            </TrackBarController>

        });



    return (
        <div className={styles.container}>
            {singleTrack ?
                <div className={styles.flex}>
                    <div className={classNames(styles.barPlaceHolderFront, styles.borderBottom)}></div>
                    <div className={classNames(styles.flex, styles.borderBottom)} style={{ width: width }}>
                        {dayBarViews}
                    </div>
                    <div className={classNames(styles.barPlaceHolderEnd, styles.borderBottom)}></div>
                </div>
                : null}

            <div className={styles.tracksContainer} >
                <TimeLineView></TimeLineView>
                <div className={styles.flex} ref={refTracksContainer}>
                    {trackViews}

                </div>
            </div>


            {!singleTrack ?
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
