import React, { ReactChild } from 'react';
import { IProps as IViewProps } from './DaysView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild
}


const DaysController: React.FC<IProps> = ({ children }: IProps) => {
    // const viewModel = useViewModelContext();

    const days = ["Mon - Oct 25", "Tue - Oct 26", "Wed - Oct 27"];


    return children({days
    }) as React.ReactElement<any>;
}

export default observer(DaysController);
