import React from 'react';
import TracksView from './TracksView';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";
import AgendaViewModel from '../../../AgendaViewModel';
import { Day } from '../../../types/types';



interface IProps {
}


const TracksController: React.FC<IProps> = ({ }: IProps) => {
    const viewModel: AgendaViewModel = useViewModelContext();

    const days: Array<Day> = viewModel.getDays();


    const handleWidthChange = (newWidth: number) => {
        console.log('newWidth: ', newWidth);
    }

    const singleTracks: boolean = true;

    return <TracksView
        handleWidthChange={handleWidthChange}
        days={days}
        singleTracks={singleTracks}
    />
}

export const Tracks = observer(TracksController);
