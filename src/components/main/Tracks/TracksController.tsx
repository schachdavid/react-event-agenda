import React, { ReactChild } from 'react';
import { IProps as IViewProps } from './TracksView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild
}


const TracksController: React.FC<IProps> = ({ children }: IProps) => {
    // const viewModel = useViewModelContext();

    const tracks = ["track 1","track 1","track 1"];

    const handleWidthChange = (newWidth: number) => {
        console.log(newWidth)
    }


    const singleTrack = true;



    return children({
        tracks, handleWidthChange, singleTrack
    }) as React.ReactElement<any>;
}

export default observer(TracksController);
