import React from 'react';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import DayBarView from './DayBarView';
import { Day } from '../../../types/types';



interface IProps {
    day: Day
}



const DayBarController: React.FC<IProps> = ({ day }: IProps) => {
    // const viewModel = useViewModelContext();

    const dayName: string = day.date.format("ddd, MMM D");;

    return <DayBarView dayName={dayName}></DayBarView>
}

export const DayBar = observer(DayBarController);
