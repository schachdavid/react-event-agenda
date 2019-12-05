import React, { useState } from 'react';
import TracksView from './TracksView';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import { AgendaViewModel } from '../../AgendaViewModel';
import { IDay } from '../../models/AgendaStore';
import { ICustomItemAction } from '../../interfaces/agendaProps';
import { DragObject } from '../../interfaces/dndInterfaces';
import moment, { Moment } from 'moment';
import { arraysMatch } from '../../util';

interface IProps {
    customItemActions?: Array<ICustomItemAction>
}


const TracksController: React.FC<IProps> = ({ customItemActions }: IProps) => {
    const viewModel: AgendaViewModel = useViewModelContext();
    const [lastMovedItemIds, setLastMovedItemId] = useState([""]);
    const [lastMovedNewStart, setLastMovedNewStart] = useState(moment());


    const days: Array<IDay> = viewModel.getDays({ uiHidden: false });
    
    const moveDragObject = (trackId: string, newStart: Moment, dragObject: DragObject) => {
        if (arraysMatch(lastMovedItemIds, dragObject.itemIds) && lastMovedNewStart.isSame(newStart)) {
            return;
        };
        viewModel.undo(true, true);
        setLastMovedItemId(dragObject.itemIds);
        setLastMovedNewStart(newStart);
        viewModel.moveItems(trackId, dragObject.clickedItemId, newStart, dragObject.itemIds);
        viewModel.pushToHistory(true);
    }

    const handleWidthChange = (newWidth: number) => {
        viewModel.setTotalTracksWidth(newWidth);
        viewModel.applyTotalTrackWidthToTrackVisibility();
    }

    const paginateRight = () => {
        viewModel.paginateRight();
    }

    const paginateLeft = () => {
        viewModel.paginateLeft();
    }

    const singleTracks: boolean = true;

    return <TracksView
        handleWidthChange={handleWidthChange}
        width={viewModel.getTotalTracksWidth()}
        days={days}
        singleTracks={singleTracks}
        customItemActions={customItemActions}
        moveDragObject={moveDragObject}
        paginateRight={paginateRight}
        canPaginateRight={viewModel.canPaginateRight()}
        paginateLeft={paginateLeft}
        canPaginateLeft={viewModel.canPaginateLeft()}
    />
}

export const Tracks = observer(TracksController);
