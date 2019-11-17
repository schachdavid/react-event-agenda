import React from 'react';

import { observer } from 'mobx-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Customizer } from 'office-ui-fabric-react';
import styles from './MainCommandBarView.module.scss';
import { invertTheme } from '../../util';
import { useColorPaletteContext } from '../../hooks/ColorPaletteContext';


export interface IProps {
    undo: () => void,
    redo: () => void,
    unselectAll: () => void,
    deleteAllSelected: () => void,
    selecting: boolean,
    numberOfSelectedItems: number
}

const MainCommandBarView: React.FC<IProps> = ({ undo, redo, selecting, numberOfSelectedItems, unselectAll, deleteAllSelected }: IProps) => {
    const colorPalette = useColorPaletteContext();

    const items: ICommandBarItemProps[] = selecting ? [
        {
            key: 'unselectAll',
            text: 'Unselect all',
            ariaLabel: 'Unselect all',
            iconProps: {
                iconName: 'ErrorBadge',
        
            },
            iconOnly: true,
            onClick: unselectAll
        }] : [
            {
                key: 'undo',
                text: 'Undo',
                ariaLabel: 'undo',

                iconProps: {
                    iconName: 'Undo'
                },
                iconOnly: true,
                onClick: undo
            },
            {
                key: 'redo',
                text: 'Redo',
                ariaLabel: 'Redo',
                iconProps: {
                    iconName: 'redo'
                },
                iconOnly: true,
                onClick: redo
            }
        ]

    const farItems = selecting ?
        [{
            key: 'deleteAllSelected',
            text: 'Delete all selected',
            ariaLabel: 'Delete all selected',
            iconProps: {
                iconName: 'Delete'
            },
            iconOnly: true,
            onClick: deleteAllSelected
        }
        ] : [
            {
                key: 'settings',
                ariaLabel: 'settings',
                iconProps: {
                    iconName: 'Settings'
                },
                iconOnly: true,
                onClick: () => console.log('settings')
            }
        ];


    return (
        <div className={styles.container}>
            {selecting ? <>
                <CommandBar items={items} farItems={farItems} />
                <div className={styles.numberOfItemsText}><span className={styles.numberOfItems}>{numberOfSelectedItems}</span>  Item{numberOfSelectedItems > 1 ? 's' : ''} selected</div>
            </>

                :
                <Customizer settings={{ theme: invertTheme(Object.assign({}, colorPalette)) }}>
                    <CommandBar items={items} farItems={farItems} />
                </Customizer>}
        </div>
    );
}

export default observer(MainCommandBarView);
