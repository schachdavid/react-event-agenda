import React from 'react';
import TracksView from './TracksView';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import {AgendaViewModel} from '../../../AgendaViewModel';
import { IDay } from '../../../models/AgendaStore';
import { ICustomItemAction } from '../../../interfaces/agendaProps';



interface IProps {
    customItemActions?: Array<ICustomItemAction>
}


const TracksController: React.FC<IProps> = ({customItemActions}: IProps) => {
    const viewModel: AgendaViewModel = useViewModelContext();

    const days: Array<IDay> = viewModel.getDays();


    const handleWidthChange = (newWidth: number) => {
        console.log('newWidth: ', newWidth);
    }

    const singleTracks: boolean = true;

    return <TracksView
        handleWidthChange={handleWidthChange}
        days={days}
        singleTracks={singleTracks}
        customItemActions={customItemActions}
    />
}

export const Tracks = observer(TracksController);
