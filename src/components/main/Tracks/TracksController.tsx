import React, { useState } from 'react';
import TracksView from './TracksView';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import {AgendaViewModel} from '../../../AgendaViewModel';
import { IDay } from '../../../models/AgendaStore';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { DragItem } from '../../../interfaces/dndInterfaces';
import moment, { Moment } from 'moment';




interface IProps {
    customItemActions?: Array<ICustomItemAction>
}


const TracksController: React.FC<IProps> = ({customItemActions}: IProps) => {
    const viewModel: AgendaViewModel = useViewModelContext();
    const [lastMovedItemId, setLastMovedItemId] = useState("");
    const [lastMovedNewStart, setLastMovedNewStart] = useState(moment());

    const days: Array<IDay> = viewModel.getDays();


    const moveDragItem = (trackId: string, newStart: Moment, dragItem: DragItem) => {
      
        if (dragItem.id === lastMovedItemId && lastMovedNewStart.isSame(newStart)) {
            return;
        };
        viewModel.undo();
        setLastMovedItemId(dragItem.id);
        setLastMovedNewStart(newStart);
        viewModel.moveItem(trackId, dragItem.id, newStart);
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
        moveDragItem={moveDragItem}
    />
}

export const Tracks = observer(TracksController);
