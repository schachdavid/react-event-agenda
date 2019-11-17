import React from 'react';
import TrackBarView from './TrackBarView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    
}



const TrackBarController: React.FC<IProps> = ({ }: IProps) => {
    // const viewModel = useViewModelContext();

    return <TrackBarView></TrackBarView>
}

export const TrackBar = observer(TrackBarController);
