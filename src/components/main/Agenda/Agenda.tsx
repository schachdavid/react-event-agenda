import React from 'react';
import { AgendaViewModel } from '../../../AgendaViewModel';
import ViewModelContext from '../../../hooks/ViewModelContext';
import { MainCommandBar } from '../MainCommandBar/MainCommandBarController';
import { Tracks } from '../Tracks/TracksController';
import styles from './Agenda.scss';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cssVars from 'css-vars-ponyfill';

// TODO: to be replaced, icons should be passed via props
// import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { IPalette, createTheme, IIconSubset } from 'office-ui-fabric-react';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { ColorPaletteContext, defaultPalette } from '../../../hooks/ColorPaletteContext';
import classNames from 'classnames';

import { Customizer } from 'office-ui-fabric-react';

import { registerIcons } from '@uifabric/styling';

import {  FiTrash2, FiSettings, FiCornerUpLeft, FiCornerUpRight, FiEdit2, FiX } from 'react-icons/fi';









interface IProps {
    agendaViewModel: AgendaViewModel,
    customItemActions?: Array<ICustomItemAction>,
    colorPalette?: Partial<IPalette>,
    className?: string,
    style?: React.CSSProperties,
    icons?: IIconSubset
}

const Agenda: React.FC<IProps> = ({
    agendaViewModel,
    customItemActions,
    colorPalette,
    className,
    style,
    icons }: IProps) => {

    registerIcons({
        icons: {
            'delete': <span className={styles.iconStrokeWidthContainer}><FiTrash2 size={'1.2em'} /></span>,
            'settings': <span className={styles.iconStrokeWidthContainer}><FiSettings size={'1.2em'} /></span>,
            'undo': <span className={styles.iconStrokeWidthContainer}><FiCornerUpLeft size={'1.2em'} /></span>,
            'redo': <span className={styles.iconStrokeWidthContainer}><FiCornerUpRight size={'1.2em'} /></span>,
            'edit': <span className={styles.iconStrokeWidthContainer}><FiEdit2 size={'1.2em'}/></span>,
            'cancel': <span className={styles.iconStrokeWidthContainer}><FiX size={'1.2em'}/></span>
        }
    });

    if (icons) registerIcons(icons);

    if (customItemActions) customItemActions.forEach((item) => {
        if(item.iconToRender) {
            let iconsToRegister = {};
            iconsToRegister[item.iconName] = item.iconToRender
            console.log(iconsToRegister);
            
            registerIcons({ icons: iconsToRegister });
        }
    });

    cssVars();

    const palette = colorPalette ? colorPalette : defaultPalette

    let themeObj = {}
    Object.entries(palette).forEach(([prop, value]) => {
        themeObj['--' + prop] = value;
    });

    cssVars({
        variables: themeObj
    });

    return (
        <div style={style} className={classNames(styles.mainComponent, className)}>
            <Customizer settings={{
                theme: createTheme({
                    palette: palette
                })
            }}>
                <ColorPaletteContext.Provider value={colorPalette ? colorPalette : defaultPalette}>
                    <ViewModelContext.Provider value={agendaViewModel}>
                        <DndProvider backend={HTML5Backend} debugMode={true}>
                            <MainCommandBar></MainCommandBar>
                            <Tracks customItemActions={customItemActions}>
                            </Tracks>
                        </DndProvider>
                    </ViewModelContext.Provider>
                </ColorPaletteContext.Provider>
            </Customizer>
        </div>
    )
};

export default Agenda;
