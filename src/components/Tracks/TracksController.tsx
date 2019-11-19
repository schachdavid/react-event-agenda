import React, { useState } from 'react';
import TracksView from './TracksView';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import {AgendaViewModel} from '../../AgendaViewModel';
import { IDay } from '../../models/AgendaStore';
import { ICustomItemAction } from '../../interfaces/agendaProps';
import { DragObject } from '../../interfaces/dndInterfaces';
import moment, { Moment } from 'moment';




interface IProps {
    customItemActions?: Array<ICustomItemAction>
}


const TracksController: React.FC<IProps> = ({customItemActions}: IProps) => {
    const viewModel: AgendaViewModel = useViewModelContext();
    const [lastMovedItemId, setLastMovedItemId] = useState("");
    const [lastMovedNewStart, setLastMovedNewStart] = useState(moment());

    const days: Array<IDay> = viewModel.getDays();


    const moveDragObject = (trackId: string, newStart: Moment, dragObject: DragObject) => {
        if (dragObject.itemIds[0] === lastMovedItemId && lastMovedNewStart.isSame(newStart)) {
            return;
        };
        if (dragObject.itemIds.length > 1) return;
        viewModel.undo(true);
        setLastMovedItemId(dragObject.itemIds[0]);
        setLastMovedNewStart(newStart);
        viewModel.moveItem(trackId, dragObject.itemIds[0], newStart);
        viewModel.pushToHistory();
    }


    const handleWidthChange = (newWidth: number) => {
        console.log('newWidth: ', newWidth);
    }

    const singleTracks: boolean = true;

    return <TracksView
        handleWidthChange={handleWidthChange}
        days={days}
        singleTracks={singleTracks}
        customItemActions={customItemActions}
        moveDragObject={moveDragObject}
    />
}

export const Tracks = observer(TracksController);
