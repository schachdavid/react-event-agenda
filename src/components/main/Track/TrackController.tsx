import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { Track as TrackData, Item } from '../../../interfaces/modelnterfaces';
import moment, { Duration } from 'moment';
import { DragItem } from '../../../interfaces/dndInterfaces';



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

    const handleDropHover = (hoverClientY: number, dragItem: DragItem) => {
        const minutes = Math.round(hoverClientY / intervalPxHeight) * intervalInMin;
        const newStart = moment(startTime).add('minutes', minutes);
        viewModel.moveItem(track.trackId, dragItem.itemId, newStart);
    }


    return <TrackView
        items={items}
        numberOfSegments={numberOfSegments}
        segmentHeight={intervalPxHeight * segmentFactor - 1}
        handleDropHover={handleDropHover}
    />
}

export const Track = observer(TrackController);
