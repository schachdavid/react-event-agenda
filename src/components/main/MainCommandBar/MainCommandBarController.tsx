import React from 'react';
import MainCommandBarView from './MainCommandBarView';
import { useViewModelContext } from '../../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    
}


const MainCommandBarController: React.FC<IProps> = ({  }: IProps) => {
    const viewModel = useViewModelContext();

    return <MainCommandBarView undo={() => viewModel.undo()} redo={() => viewModel.redo()}></MainCommandBarView>
}

export const MainCommandBar = observer(MainCommandBarController);
