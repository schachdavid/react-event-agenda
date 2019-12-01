import React from 'react';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import TrackView from './TrackView';
import { ITrack as TrackData, IItem } from '../../models/AgendaStore';
import moment, { Duration, Moment } from 'moment';
import uuid from 'uuid';
import { ICustomItemAction } from '../../interfaces/agendaProps';
import { DragObject } from '../../interfaces/dndInterfaces';
import { UIState } from '../../models/UIStore';
import { ItemUIState } from '../../models/ItemModel';


interface IProps {
    track: TrackData,
    customItemActions?: Array<ICustomItemAction>,
    moveDragObject: (trackId: string, newStart: Moment, dragObject: DragObject) => void
}


const TrackController: React.FC<IProps> = ({ track, customItemActions, moveDragObject }: IProps) => {
    const viewModel = useViewModelContext();

    const items: Array<IItem> = track.items;

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    const segmentFactor = viewModel.getSegmentFactor();
    const day = viewModel.getDayForTrack(track.id);
    const startTimeLineTmp = viewModel.getTimeLineStartTime(day ? day.startTime : undefined);
    const startTimeLine = startTimeLineTmp ? startTimeLineTmp : moment();
    const endTimeLineTmp = viewModel.getTimeLineEndTime(day ? day.startTime : undefined);
    const endTimeLine = endTimeLineTmp ? endTimeLineTmp : moment();

    const duration: Duration = endTimeLine ? moment.duration(endTimeLine.diff(startTimeLine)) : moment.duration();

    const minutes = duration.asMinutes();

    const numberOfSegments = minutes / intervalInMin / segmentFactor;

    const smallSegmentHeight = intervalPxHeight;

    const enableHover = viewModel.getUIState() === UIState.Normal;



    const handleDropHover = (hoverClientY: number, dragObject: DragObject) => {
        if (dragObject.itemIds.length !== 0 || dragObject.itemIds[0] !== dragObject.clickedItemId) {
            //calc new hoverClientY if multiple items are being dragged
            const items = viewModel.getItems(undefined, dragObject.itemIds);
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id === dragObject.clickedItemId) break;
                const itemDuration: number = moment.duration(item.end.diff(item.start)).asMinutes();
                const height = itemDuration / intervalInMin * intervalPxHeight;
                hoverClientY = hoverClientY - height;
            }
        }
        let newStart: Moment;
        if (hoverClientY < 0) newStart = moment(startTimeLine)
        else {
            const minutesStart = Math.round(hoverClientY / intervalPxHeight) * intervalInMin;
            newStart = moment(startTimeLine).add(minutesStart, 'minutes');
        }
        moveDragObject(track.id, newStart, dragObject);
    }






    let drawUpItemId: string;
    const handleInitializeDrawUp = (initialMousePosition: number) => {
        viewModel.updateUIState(UIState.Creating);
        drawUpItemId = uuid();
        const minutesStart = Math.floor(initialMousePosition / intervalPxHeight) * intervalInMin;
        const itemStart = moment(startTimeLine).add(minutesStart, 'minutes');
        const itemEnd = moment(itemStart).add(intervalInMin, 'minutes');
        viewModel.addItem({ id: drawUpItemId, start: itemStart, end: itemEnd }, track.id, true);
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
        const newEnd = moment(startTimeLine).add(minutesEnd, 'minutes');
        const newStart = moment(startTimeLine).add(minutesStart, 'minutes');
        const item = viewModel.getItem(drawUpItemId);
        if (item && (!item.start.isSame(newStart) || !item.end.isSame(newEnd))) {
            viewModel.adjustItemStartTime(drawUpItemId, newStart);
            viewModel.adjustItemEndTime(drawUpItemId, newEnd);
        }
    }

    const finishDrawUp = () => {
        viewModel.updateUIState(UIState.Normal);
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
