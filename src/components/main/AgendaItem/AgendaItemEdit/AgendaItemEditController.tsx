import React, { ReactChild } from 'react';
import { IProps as IViewProps } from './AgendaItemEditView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild,
    topPx: number,
    height: number,
}



const AgendaItemController: React.FC<IProps> = ({ children, topPx, height }: IProps) => {
    // const viewModel = useViewModelContext();
   

    return children({
        topPx: topPx,
        height: height,
    }) as React.ReactElement<any>;
}



export default observer(AgendaItemController);
