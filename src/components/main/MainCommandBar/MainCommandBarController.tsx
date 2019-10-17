import React, { ReactChild } from 'react';
import { IProps as IViewProps } from './MainCommandBarView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild
}


const MainCommandBarController: React.FC<IProps> = ({ children }: IProps) => {
    // const viewModel = useViewModelContext();

    return children({
    }) as React.ReactElement<any>;
}

export default observer(MainCommandBarController);
