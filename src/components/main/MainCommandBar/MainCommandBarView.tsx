import React from 'react';

import { observer } from 'mobx-react';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Customizer } from 'office-ui-fabric-react';
import { createTheme } from 'office-ui-fabric-react';
import { getPalette } from '../../../theme';

import styles from './MainCommandBarView.module.scss';


export interface IProps {
}

const MainCommandBarView: React.FC<IProps> = ({ }: IProps) => {
    let palette = getPalette();
    const items = [
        {
            key: 'undo',
            ariaLabel: 'undo',

            iconProps: {
                iconName: 'Undo'
            },
            iconOnly: true,
            onClick: () => console.log('Share')
        },
        {
            key: 'redo',
            ariaLabel: 'redo',
            iconProps: {
                iconName: 'redo'
            },
            iconOnly: true,
            onClick: () => console.log('Share')
        }
    ]

    const farItems = [
        {
            key: 'sort',
            ariaLabel: 'Sort',
            iconProps: {
                iconName: 'Settings'
            },
            iconOnly: true,
            onClick: () => console.log('Sort')
        }
    ]

    //background color
    palette.white = palette.themePrimary;

    //icon color
    palette.themePrimary = "#ffffff";

    //hover background color
    palette.neutralLighter = palette.themeDark;

    // font color
    palette.neutralPrimary = "#ffffff";

    //hover icon color
    palette.themeDarkAlt = "#ffffff";

    // hover font color
    palette.neutralDark = "#ffffff";






    const commandBarTheme = createTheme({
        palette: palette
    });
    return (
            <div className={styles.container}>
                <Customizer settings={{theme: commandBarTheme}}>
                    <CommandBar items={items} farItems={farItems} />
                </Customizer>
            </div>
    );
}

export default observer(MainCommandBarView);
