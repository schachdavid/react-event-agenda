import React from 'react';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import DayBarView from './DayBarView';
import { IDay } from '../../../models/AgendaStore';



interface IProps {
    day: IDay
}



const DayBarController: React.FC<IProps> = ({ day }: IProps) => {
    // const viewModel = useViewModelContext();

    const dayName: string = day.date.format("ddd, MMM D");;

    return <DayBarView dayName={dayName}></DayBarView>
}

export const DayBar = observer(DayBarController);
