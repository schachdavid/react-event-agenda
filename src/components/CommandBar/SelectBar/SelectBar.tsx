import React from 'react';
import { observer } from 'mobx-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import styles from '../CommandBarView.module.scss';


export interface IProps {
    unselectAll: () => void,
    deleteAllSelected: () => void,
    numberOfSelectedItems: number,
    customItemSelectionActionsFar?: ICommandBarItemProps[],

}

const SelectBar: React.FC<IProps> = ({ numberOfSelectedItems, unselectAll, deleteAllSelected, customItemSelectionActionsFar }: IProps) => {

    const items: ICommandBarItemProps[] = [
        {
            key: 'unselectAll',
            text: 'Unselect all',
            ariaLabel: 'Unselect all',
            iconProps: {
                iconName: 'ErrorBadge',

            },
            iconOnly: true,
            onClick: unselectAll
        }] 

    let farItems: ICommandBarItemProps[] = [{
        key: 'deleteAllSelected',
        text: 'Delete all selected',
        ariaLabel: 'Delete all selected',
        iconProps: {
            iconName: 'Delete'
        },
        iconOnly: true,
        onClick: deleteAllSelected
    }
    ]

    if(customItemSelectionActionsFar) farItems = farItems.concat(customItemSelectionActionsFar);


    return (
        <>
                <CommandBar items={items} farItems={farItems} className={styles.commandBar} />
                <div className={styles.numberOfItemsText}><span className={styles.numberOfItems}>{numberOfSelectedItems}</span>  Item{numberOfSelectedItems > 1 ? 's' : ''} selected</div>
        </>
    );
}

export default observer(SelectBar);
