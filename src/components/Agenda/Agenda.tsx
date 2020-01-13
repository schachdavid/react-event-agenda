import React, { useEffect } from 'react';
import { AgendaViewModel } from '../../AgendaViewModel';
import ViewModelContext from '../../hooks/ViewModelContext';
import { MainCommandBar } from '../CommandBar/CommandBarController';
import { Tracks } from '../Tracks/TracksController';
import styles from './Agenda.scss';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cssVars from 'css-vars-ponyfill';
import { IPalette, createTheme, IIconSubset, ICommandBarItemProps } from 'office-ui-fabric-react';
import { ICustomItemAction } from '../../interfaces/agendaProps';
import { ColorPaletteContext, defaultPalette } from '../../hooks/ColorPaletteContext';
import classNames from 'classnames';

import { Customizer } from 'office-ui-fabric-react';

import { registerIcons } from '@uifabric/styling';

import { FiTrash2, FiSettings, FiCornerUpLeft, FiCornerUpRight, FiEdit2, FiX, FiCheckSquare, FiSquare, FiXCircle, FiPlusCircle, FiChevronDown, FiChevronUp, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { DraggedAgendaItems } from '../DraggedAgendaItems/DraggedAgendaItemsController';
import ShortKeyHandler from '../ShortKeyHandler/ShortKeyHandler';









interface IProps {
    agendaViewModel: AgendaViewModel,
    customItemActions?: Array<ICustomItemAction>,
    customAgendaActions?: ICommandBarItemProps[],
    customAgendaActionsFar?: any[],
    customItemSelectionActionsFar?: ICommandBarItemProps[],
    colorPalette?: Partial<IPalette>,
    className?: string,
    style?: React.CSSProperties,
    icons?: IIconSubset
}

const Agenda: React.FC<IProps> = ({
    agendaViewModel,
    customItemActions,
    customAgendaActions,
    customAgendaActionsFar,
    customItemSelectionActionsFar,
    colorPalette,
    className,
    style,
    icons }: IProps) => {

    useEffect(() => {
        if (agendaViewModel.handleDataChange) {
            window.addEventListener('beforeunload', agendaViewModel.handleDataChange.flush);
            return () => { agendaViewModel.handleDataChange ? window.removeEventListener('beforeunload', agendaViewModel.handleDataChange.flush) : undefined };
        }
        return;
    }, []);

    registerIcons({
        icons: {
            'delete': <span className={styles.iconStrokeWidthContainer}><FiTrash2 size={'1.2em'} /></span>,
            'settings': <span className={styles.iconStrokeWidthContainer}><FiSettings size={'1.2em'} /></span>,
            'undo': <span className={styles.iconStrokeWidthContainer}><FiCornerUpLeft size={'1.2em'} /></span>,
            'redo': <span className={styles.iconStrokeWidthContainer}><FiCornerUpRight size={'1.2em'} /></span>,
            'edit': <span className={styles.iconStrokeWidthContainer}><FiEdit2 size={'1.2em'} /></span>,
            'cancel': <span className={styles.iconStrokeWidthContainer}><FiX size={'1.2em'} /></span>,
            'Checkbox': <span className={styles.iconStrokeWidthContainer}><FiSquare size={'1.2em'} /></span>,
            'CheckboxCompositeReversed': <span className={styles.iconStrokeWidthContainer}><FiCheckSquare size={'1.2em'} /></span>,
            'ErrorBadge': <span className={styles.iconStrokeWidthContainer}><FiXCircle size={'1.2em'} /></span>,
            'AddTo': <span className={styles.iconStrokeWidthContainer}><FiPlusCircle size={'1em'} /></span>,
            'ChevronUp': <span className={styles.iconStrokeWidthContainer}><FiChevronUp size={'1.4em'} /></span>,
            'ChevronDown': <span className={styles.iconStrokeWidthContainer}><FiChevronDown size={'1.4em'} /></span>,
            'ChevronLeft': <span className={styles.iconStrokeWidthContainer}><FiChevronLeft size={'1.2em'} /></span>,
            'ChevronRight': <span className={styles.iconStrokeWidthContainer}><FiChevronRight size={'1.2em'} /></span>
        }
    });

    if (icons) registerIcons(icons);

    if (customItemActions) customItemActions.forEach((item) => {
        if (item.iconToRender) {
            let iconsToRegister = {};
            iconsToRegister[item.iconName] = item.iconToRender
            registerIcons({ icons: iconsToRegister });
        }
    });

    cssVars();

    const palette = colorPalette ? colorPalette : defaultPalette;

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
                    palette: palette,
                    defaultFontStyle: { fontFamily: 'Open Sans'},
                })
            }}>
                <ColorPaletteContext.Provider value={colorPalette ? colorPalette : defaultPalette}>
                    <ViewModelContext.Provider value={agendaViewModel}>
                        <DndProvider backend={HTML5Backend} debugMode={true}>
                            <ShortKeyHandler/>
                            <MainCommandBar
                                customAgendaActionsFar={customAgendaActionsFar}
                                customAgendaActions={customAgendaActions}
                                customItemSelectionActionsFar={customItemSelectionActionsFar}
                            />
                            <Tracks customItemActions={customItemActions}>
                            </Tracks>
                            <DraggedAgendaItems />
                        </DndProvider>
                    </ViewModelContext.Provider>
                </ColorPaletteContext.Provider>
            </Customizer>
        </div>
    )
};

export default Agenda;
