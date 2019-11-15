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
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { loadTheme, IPalette } from 'office-ui-fabric-react';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { ColorPaletteContext, defaultPalette } from '../../../hooks/ColorPaletteContext';





interface IProps {
    agendaViewModel: AgendaViewModel,
    customItemActions?: Array<ICustomItemAction>,
    colorPalette?: Partial<IPalette>
}

const Agenda: React.FC<IProps> = ({ agendaViewModel, customItemActions, colorPalette }: IProps) => {
    initializeIcons();

    loadTheme({
        palette: colorPalette ? colorPalette : defaultPalette
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
        <div className={styles.mainComponent}>
            <ColorPaletteContext.Provider value={colorPalette ? colorPalette : defaultPalette}>
                <ViewModelContext.Provider value={agendaViewModel}>
                    <DndProvider backend={HTML5Backend} debugMode={true}>
                        <MainCommandBar></MainCommandBar>
                        <Tracks customItemActions={customItemActions}>
                        </Tracks>
                    </DndProvider>
                </ViewModelContext.Provider>
            </ColorPaletteContext.Provider>
        </div>
    )
};

export default Agenda;
