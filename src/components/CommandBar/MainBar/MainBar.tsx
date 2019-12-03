import React from 'react';
import { observer } from 'mobx-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Customizer } from 'office-ui-fabric-react';
import styles from '../CommandBarView.module.scss';
import { invertTheme } from '../../../util';
import { useColorPaletteContext } from '../../../hooks/ColorPaletteContext';


export interface IProps {
    undo: () => void,
    redo: () => void,
    customAgendaActions?: ICommandBarItemProps[],
    customAgendaActionsFar?: ICommandBarItemProps[],
}

const CommandBarView: React.FC<IProps> = ({ undo, redo, customAgendaActions, customAgendaActionsFar }: IProps) => {
    const colorPalette = useColorPaletteContext();

    let items: ICommandBarItemProps[] = [
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

    if(customAgendaActions) items = items.concat(customAgendaActions)


    let farItems: ICommandBarItemProps[] = [];

    if(customAgendaActionsFar) farItems = farItems.concat(customAgendaActionsFar)



    return (
        <>
            <div className={styles.logo}>
                AgendaBuilder
                    </div>
            <Customizer settings={{ theme: invertTheme(Object.assign({}, colorPalette)) }}>
                <CommandBar items={items} farItems={farItems} className={styles.commandBar} />
            </Customizer>
        </>
    );
}

export default observer(CommandBarView);
