import React from 'react';
import MainCommandBarView from './MainCommandBarView';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import { UIState } from '../../models/UIStore';
import { ItemUIState } from '../../models/ItemModel';



interface IProps {

}


const MainCommandBarController: React.FC<IProps> = ({ }: IProps) => {
    const viewModel = useViewModelContext();

    const deleteAllSelected = () => {
        viewModel.getItems({uiState: ItemUIState.Selected}).forEach(item => viewModel.deleteItem(item.id, true));
        viewModel.updateUIState(UIState.Normal);
        viewModel.pushToHistory();
    };

    return <MainCommandBarView
        numberOfSelectedItems={viewModel.getItems({uiState: ItemUIState.Selected}).length}
        selecting={viewModel.getUIState() === UIState.Selecting}
        undo={() => viewModel.undo()}
        redo={() => viewModel.redo()}
        unselectAll={() => viewModel.unselectAll()} 
        deleteAllSelected={deleteAllSelected}/>
}

export const MainCommandBar = observer(MainCommandBarController);
