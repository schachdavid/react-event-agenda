import React from 'react';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import SampleView from './SampleView';



interface IProps {
}


const SampleController: React.FC<IProps> = ({  }: IProps) => {
    // const viewModel = useViewModelContext();

    return <SampleView></SampleView>
}

export const Sample = observer(SampleController);
