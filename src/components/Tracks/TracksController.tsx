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
import findLastIndex from 'lodash/findLastIndex'




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

    const getDaysToReveal = (numberToReveal: number) => {
        const allDays = viewModel.getDays();
        const daysToReveal: Array<IDay> = [];

        const lastVisibleIndex = findLastIndex(allDays, day => !day.uiHidden);
        if (lastVisibleIndex !== -1) {
            for (let i = lastVisibleIndex + 1; i < allDays.length; i++) {
                daysToReveal.push(allDays[i]);
                numberToReveal--;
                if (numberToReveal === 0) return daysToReveal;
            }
        } else {
            return daysToReveal;
        }

        const firstVisibleIndex = allDays.findIndex(day => !day.uiHidden);
        for (let i = firstVisibleIndex - 1; i >= 0; i--) {
            daysToReveal.push(allDays[i]);
            numberToReveal--;
            if (numberToReveal === 0) return daysToReveal;
        }
        return daysToReveal;
    }

    const getDisplayableTracks = (width: number) => {
        let displayableTracks = Math.floor(width / 200);
        if (displayableTracks === 0) displayableTracks = 1;
        return displayableTracks;        
    }


    const handleWidthChange = (newWidth: number) => {
        const days: Array<IDay> = viewModel.getDays({ uiHidden: false }); //TODO figure out why I need to do this and not use the days directly
        const displayableTracks = getDisplayableTracks(newWidth);
        if (days.length > displayableTracks) {
            const numberOfDaysToHide = days.length - displayableTracks;
            for(let i = 0; i<numberOfDaysToHide; i++) {
                viewModel.setDayUiHidden(days[days.length - 1 - i].id, true);
            }
        } else if (days.length < displayableTracks) {
            const daysToReveal = getDaysToReveal(displayableTracks - days.length);
            if (daysToReveal.length > 0) daysToReveal.forEach(day => viewModel.setDayUiHidden(day.id, false));
        }
        viewModel.setTotalTracksWidth(newWidth);
        viewModel.overWriteCurrentHistoryEntry();
    }

    const paginateRight = () => {
        const displayableTracks = getDisplayableTracks(viewModel.getTotalTracksWidth());
        viewModel.paginateRight(displayableTracks);
    }

    const paginateLeft = () => {
        const displayableTracks = getDisplayableTracks(viewModel.getTotalTracksWidth());
        viewModel.paginateLeft(displayableTracks);
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
        paginateLeft={paginateLeft}

    />
}

export const Tracks = observer(TracksController);
