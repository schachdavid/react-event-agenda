import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { Track as TrackData, Item } from '../../../types/types';
import moment, { Duration } from 'moment';



interface IProps {
    track: TrackData,
}


const TrackController: React.FC<IProps> = ({ track }: IProps) => {
    const viewModel = useViewModelContext();
    const items: Array<Item> = track.items;

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    const segmentFactor = viewModel.getSegmentFactor();
    const endTime = viewModel.getEndTime();
    const startTime = viewModel.getStartTime();


    const duration: Duration = moment.duration(endTime.diff(startTime));
    const minutes = duration.asMinutes();

    const numberOfSegments = minutes / intervalInMin / segmentFactor;


    return <TrackView
        items={items}
        numberOfSegments={numberOfSegments}
        segmentHeight={intervalPxHeight * segmentFactor - 1}
    />
}

export const Track = observer(TrackController);
