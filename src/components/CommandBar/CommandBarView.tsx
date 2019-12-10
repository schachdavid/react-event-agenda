import React from 'react';
import { observer } from 'mobx-react';
import styles from './CommandBarView.module.scss';
import SelectBar from './SelectBar/SelectBar';
import MainBar from './MainBar/MainBar';
import { ICommandBarItemProps } from 'office-ui-fabric-react';


export interface IProps {
    undo: () => void,
    redo: () => void,
    canUndo: boolean,
    canRedo: boolean,
    unselectAll: () => void,
    deleteAllSelected: () => void,
    selecting: boolean,
    numberOfSelectedItems: number,
    customAgendaActions?: ICommandBarItemProps[],
    customAgendaActionsFar?: ICommandBarItemProps[],
    customItemSelectionActionsFar?: ICommandBarItemProps[],
}

const CommandBarView: React.FC<IProps> = ({ 
    undo, 
    canUndo,
    canRedo,
    redo, 
    selecting, 
    numberOfSelectedItems, 
    unselectAll, 
    deleteAllSelected,
    customAgendaActions,
    customAgendaActionsFar,
    customItemSelectionActionsFar}: IProps) => {
   
    return (
        <div className={styles.container}>
            {selecting ?
                <SelectBar
                    deleteAllSelected={deleteAllSelected}
                    numberOfSelectedItems={numberOfSelectedItems}
                    unselectAll={unselectAll} 
                    customItemSelectionActionsFar={customItemSelectionActionsFar}
                    />
                :
                <MainBar
                    redo={redo}
                    undo={undo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    customAgendaActions={customAgendaActions}
                    customAgendaActionsFar={customAgendaActionsFar}
                />
            }
        </div>
    );
}

export default observer(CommandBarView);
