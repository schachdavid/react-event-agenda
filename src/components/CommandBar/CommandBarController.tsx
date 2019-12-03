import React from 'react';
import MainCommandBarView from './CommandBarView';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import { observer } from "mobx-react";
import { UIState } from '../../models/UIStore';
import { ItemUIState } from '../../models/ItemModel';
import { ICommandBarItemProps } from 'office-ui-fabric-react';



interface IProps {
    customAgendaActions?: ICommandBarItemProps[],
    customAgendaActionsFar?: ICommandBarItemProps[],
    customItemSelectionActionsFar?: ICommandBarItemProps[],
}


const CommandBarController: React.FC<IProps> = ({ customAgendaActions,
    customAgendaActionsFar,
    customItemSelectionActionsFar
}: IProps) => {
    const viewModel = useViewModelContext();

    const deleteAllSelected = () => {
        viewModel.getItems({ uiState: ItemUIState.Selected }).forEach(item => viewModel.deleteItem(item.id, true));
        viewModel.updateUIState(UIState.Normal);
        viewModel.pushToHistory();
    };

    return <MainCommandBarView
        numberOfSelectedItems={viewModel.getItems({ uiState: ItemUIState.Selected }).length}
        selecting={viewModel.getUIState() === UIState.Selecting}
        undo={() => viewModel.undo()}
        redo={() => viewModel.redo()}
        unselectAll={() => viewModel.unselectAll()}
        deleteAllSelected={deleteAllSelected}
        customAgendaActions={customAgendaActions}
        customAgendaActionsFar={customAgendaActionsFar}
        customItemSelectionActionsFar={customItemSelectionActionsFar}
    />

}

export const MainCommandBar = observer(CommandBarController);
