import React from 'react';
import { useViewModelContext } from '../../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { ITrack as TrackData, IItem } from '../../../models/AgendaStore';
import moment, { Duration, Moment } from 'moment';
import uuid from 'uuid';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { DragItem } from '../../../interfaces/dndInterfaces';
import { UIState } from '../../../models/UIStore';
import { ItemUIState } from '../../../models/ItemModel';



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

    const smallSegmentHeight = intervalPxHeight;

    const enableHover = viewModel.getUIState() === UIState.Normal;

    const handleDropHover = (hoverClientY: number, dragItem: DragItem) => {
        const minutesStart = Math.round(hoverClientY / intervalPxHeight) * intervalInMin;
        const newStart = moment(startTime).add(minutesStart, 'minutes');
        moveDragItem(track.id, newStart, dragItem);
    }






    let drawUpItemId: string;
    const handleInitializeDrawUp = (initialMousePosition: number) => {
        viewModel.setUIState(UIState.Creating);
        drawUpItemId = uuid();
        const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
        const itemStart = moment(startTime).add(minutesStart, 'minutes');
        const itemEnd = moment(itemStart).add(intervalInMin, 'minutes');
        viewModel.addItem({ id: drawUpItemId, start: itemStart, end: itemEnd }, track.id, true);
        viewModel.pushToHistory();
    }

    const handleDrawUp = (initialMousePosition: number, currentMousePosition: number) => {
        let minutesStart: number;
        let minutesEnd: number;
        if (currentMousePosition > Math.floor(initialMousePosition / intervalPxHeight) * intervalPxHeight) {
            minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
            minutesEnd = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if (minutesEnd == minutesStart) minutesEnd += intervalInMin;
        } else {
            minutesEnd = Math.ceil(initialMousePosition / intervalPxHeight) * intervalInMin;
            minutesStart = Math.round(currentMousePosition / intervalPxHeight) * intervalInMin;
            if (minutesEnd == minutesStart) minutesStart -= intervalInMin;
        }
        const newEnd = moment(startTime).add(minutesEnd, 'minutes');
        const newStart = moment(startTime).add(minutesStart, 'minutes');
        const item = viewModel.getItem(drawUpItemId);
        if (item && (!item.start.isSame(newStart) || !item.end.isSame(newEnd))){
            // viewModel.undo();
            viewModel.adjustItemStartTime(drawUpItemId, newStart);
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
            // viewModel.pushToHistory();
        }
    }

    const finishDrawUp = () => {
        viewModel.setUIState(UIState.Normal);
        viewModel.pushToHistory();
        viewModel.updateItemUIState(drawUpItemId, ItemUIState.Editing);
    }


    return <TrackView
        items={items}
        numberOfSegments={numberOfSegments}
        numberOfSmallSegments={segmentFactor}
        smallSegmentHeight={smallSegmentHeight}
        handleDropHover={handleDropHover}
        handleInitializeDrawUp={handleInitializeDrawUp}
        handleDrawUp={handleDrawUp}
        finishDrawUp={finishDrawUp}
        customItemActions={customItemActions}
        enableHover={enableHover}
    />
}

export const Track = observer(TrackController);
