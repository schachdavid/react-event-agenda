import React, { ReactChild } from 'react';
import { IProps as IViewProps } from './DayBarView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild
}


const DayBarController: React.FC<IProps> = ({ children }: IProps) => {
    // const viewModel = useViewModelContext();


    return children({ 
    }) as React.ReactElement<any>;
}

export default observer(DayBarController);
