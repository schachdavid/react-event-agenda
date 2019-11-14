import React from 'react';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { ITrack as TrackData, IItem } from '../../../models/AgendaStore';
import moment, { Duration, Moment } from 'moment';
import uuid from 'uuid';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { DragItem } from '../../../interfaces/dndInterfaces';



interface IProps {
    track: TrackData,
    customItemActions?: Array<ICustomItemAction>,
    moveDragItem: (trackId: string, newStart: Moment, dragItem: DragItem) => void


}


const TrackController: React.FC<IProps> = ({ track, customItemActions, moveDragItem }: IProps) => {



    const viewModel = useViewModelContext();

    const items: Array<IItem> = track.items;

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    const segmentFactor = viewModel.getSegmentFactor();
    const day = viewModel.getDayForTrack(track.id);
    const startTimeTmp = viewModel.getTimeLineStartTime(day ? day.startTime : undefined);
    const startTime = startTimeTmp ? startTimeTmp : moment();
    const endTimeTmp = viewModel.getTimeLineEndTime(day ? day.startTime : undefined);
    const endTime = endTimeTmp ? endTimeTmp : moment();



    const duration: Duration = endTime ? moment.duration(endTime.diff(startTime)) : moment.duration();

    const minutes = duration.asMinutes();

    const numberOfSegments = minutes / intervalInMin / segmentFactor;

    const handleDropHover = (hoverClientY: number, dragItem: DragItem) => {
        const minutesStart = Math.round(hoverClientY / intervalPxHeight) * intervalInMin;
        const newStart = moment(startTime).add(minutesStart, 'minutes');
        moveDragItem(track.id, newStart, dragItem);
    }






    let drawUpItemId: string;
    const handleInitializeDrawUp = (initialMousePosition: number) => {
        drawUpItemId = uuid();
        const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
        const itemStart = moment(startTime).add(minutesStart, 'minutes');
        const itemEnd = moment(itemStart).add(intervalInMin, 'minutes');
        viewModel.addItem({ id: drawUpItemId, start: itemStart, end: itemEnd }, track.id);
    }

    const handleDrawUp = (initialMousePosition: number, currentMousePosition: number) => {
        if (currentMousePosition > Math.floor(initialMousePosition / intervalPxHeight) * intervalPxHeight) {
            const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
            const newStart = moment(startTime).add(minutesStart, 'minutes');
            viewModel.adjustItemStartTime(drawUpItemId, newStart);
            let minutesEnd = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if (minutesEnd == minutesStart) minutesEnd += intervalInMin;
            const newEnd = moment(startTime).add(minutesEnd, 'minutes');
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
        } else {
            const minutesEnd = Math.ceil(initialMousePosition / intervalPxHeight) * intervalInMin;
            const newEnd = moment(startTime).add(minutesEnd, 'minutes');
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
            let minutesStart = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if (minutesEnd == minutesStart) minutesStart -= intervalInMin;
            const newStart = moment(startTime).add(minutesStart, 'minutes');
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
        customItemActions={customItemActions}
    />
}

export const Track = observer(TrackController);
