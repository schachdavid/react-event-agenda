import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { ITrack as TrackData, IItem } from '../../../models/MainModel';
import moment, { Duration } from 'moment';
import { DragItem } from '../../../interfaces/dndInterfaces';
import uuid from 'uuid';



interface IProps {
    track: TrackData,
}


const TrackController: React.FC<IProps> = ({ track }: IProps) => {
    const viewModel = useViewModelContext();
    const items: Array<IItem> = track.items;

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    const segmentFactor = viewModel.getSegmentFactor();
    const endTime = viewModel.getEndTime();
    const startTime = viewModel.getStartTime();


    const duration: Duration = moment.duration(endTime.diff(startTime));
    const minutes = duration.asMinutes();

    const numberOfSegments = minutes / intervalInMin / segmentFactor;

    const handleDropHover = (hoverClientY: number, dragItem: DragItem) => {
        const minutesStart = Math.round(hoverClientY / intervalPxHeight) * intervalInMin;
        const newStart = moment(startTime).add('minutes', minutesStart);
        viewModel.moveItem(track.id, dragItem.id, newStart);
    }



    let drawUpItemId: string;
    const handleInitializeDrawUp = (initialMousePosition: number) => {
        drawUpItemId = uuid();
        const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
        const itemStart = moment(startTime).add('minutes', minutesStart);
        const itemEnd = moment(itemStart).add('minutes', intervalInMin);
        viewModel.addItem({ id: drawUpItemId, start: itemStart, end: itemEnd}, track.id);
    }
    
    const handleDrawUp = (initialMousePosition: number, currentMousePosition: number) => {
        if(currentMousePosition > Math.floor(initialMousePosition / intervalPxHeight) * intervalPxHeight) {
            const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
            const newStart = moment(startTime).add('minutes', minutesStart);
            viewModel.adjustItemStartTime(drawUpItemId, newStart);
            let minutesEnd = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if(minutesEnd == minutesStart) minutesEnd += intervalInMin;
            const newEnd = moment(startTime).add('minutes', minutesEnd);
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
        } else {
            const minutesEnd = Math.ceil(initialMousePosition / intervalPxHeight) * intervalInMin;
            const newEnd = moment(startTime).add('minutes', minutesEnd);
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
            let minutesStart = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if(minutesEnd == minutesStart) minutesStart -= intervalInMin;
            const newStart = moment(startTime).add('minutes', minutesStart);
            viewModel.adjustItemStartTime(drawUpItemId, newStart);
        }
    }


    return <TrackView
        items={items}
        numberOfSegments={numberOfSegments}
        segmentHeight={intervalPxHeight * segmentFactor - 1}
        handleDropHover={handleDropHover}
        handleInitializeDrawUp={handleInitializeDrawUp}
        handleDrawUp={handleDrawUp}
    />
}

export const Track = observer(TrackController);
