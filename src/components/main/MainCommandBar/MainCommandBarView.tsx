import React from 'react';

import { observer } from 'mobx-react';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Customizer } from 'office-ui-fabric-react';
import styles from './MainCommandBarView.module.scss';
import { invertTheme } from '../../../util';
import { useColorPaletteContext } from '../../../hooks/ColorPaletteContext';


export interface IProps {
    undo: () => any;
    redo: () => any
}

const MainCommandBarView: React.FC<IProps> = ({undo, redo}: IProps) => {

    const colorPalette = useColorPaletteContext();

    const items = [
        {
            key: 'undo',
            ariaLabel: 'undo',

            iconProps: {
                iconName: 'Undo'
            },
            iconOnly: true,
            onClick: undo
        },
        {
            key: 'redo',
            ariaLabel: 'redo',
            iconProps: {
                iconName: 'redo'
            },
            iconOnly: true,
            onClick: redo
        }
    ]

    const farItems = [
        {
            key: 'settings',
            ariaLabel: 'settings',
            iconProps: {
                iconName: 'Settings'
            },
            iconOnly: true,
            onClick: () => console.log('settings')
        }
    ]

    
    return (
            <div className={styles.container}>
                <Customizer settings={{theme: invertTheme(Object.assign({}, colorPalette))}}>
                    <CommandBar items={items} farItems={farItems} />
                </Customizer>
            </div>
    );
}

export default observer(MainCommandBarView);
