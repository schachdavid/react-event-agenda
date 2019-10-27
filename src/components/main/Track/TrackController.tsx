import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { ITrack as TrackData, IItem } from '../../../models/MainModel';
import moment, { Duration } from 'moment';
import { DragItem } from '../../../interfaces/dndInterfaces';



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



    // let drawUpItem: IItem;
    // const handleInitializeDrawUp = () => {
    //     // drawUpItem = new Item({id: uuid()})
    //     viewModel.addItem();
    // }
    
    // const handleDrawUp = (initialMousePosition: number, currentMousePosition: number) => {
    //     if(currentMousePosition > initialMousePosition) {
    //         const minutesStart = Math.round(initialMousePosition / intervalPxHeight) * intervalInMin;
    //         const newStart = moment(startTime).add('minutes', minutesStart);
    //         drawUpItem.start = newStart;
    //         let minutesEnd = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
    //         if(minutesEnd == minutesStart) minutesEnd += intervalInMin;
    //         const newEnd = moment(startTime).add('minutes', minutesEnd);
    //         drawUpItem.end = newEnd;
    //     } else {
    //         const minutesEnd = Math.round(initialMousePosition / intervalPxHeight) * intervalInMin;
    //         const newEnd = moment(startTime).add('minutes', minutesEnd);
    //         drawUpItem.end = newEnd;
    //         let minutesStart = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
    //         if(minutesEnd == minutesStart) minutesStart -= intervalInMin;
    //         const newStart = moment(startTime).add('minutes', minutesStart);
    //         drawUpItem.start = newStart;
    //     }
    // }


    return <TrackView
        items={items}
        numberOfSegments={numberOfSegments}
        segmentHeight={intervalPxHeight * segmentFactor - 1}
        handleDropHover={handleDropHover}
        // handleInitializeDrawUp={handleInitializeDrawUp}
        // handleDrawUp={handleDrawUp}
    />
}

export const Track = observer(TrackController);
