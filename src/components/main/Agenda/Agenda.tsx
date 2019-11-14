import React from 'react';
import { AgendaViewModel } from '../../../AgendaViewModel';
import ViewModelContext from '../../../ViewModelContext';
import { MainCommandBar } from '../MainCommandBar/MainCommandBarController';
import { Tracks } from '../Tracks/TracksController';
import styles from './Agenda.scss';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cssVars from 'css-vars-ponyfill';
import { getPalette } from './../../../theme';

// TODO: to be replaced, icons should be passed via props
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { loadTheme } from 'office-ui-fabric-react';
import { ICustomItemAction } from '../../../interfaces/agendaProps';


initializeIcons();

loadTheme({
    palette: getPalette()
});





interface IProps {
    agendaViewModel: AgendaViewModel,
    customItemActions?: Array<ICustomItemAction>
}

cssVars();

const colorPalette = getPalette();

let themeObj = {}
Object.entries(colorPalette).forEach(([prop, value]) => {
    themeObj['--' + prop] = value;
});

cssVars({
    variables: themeObj
});


const Agenda: React.FC<IProps> = ({ agendaViewModel, customItemActions }: IProps) => {

    return (
        <div className={styles.mainComponent}>
            <ViewModelContext.Provider value={agendaViewModel}>
                <DndProvider backend={HTML5Backend} debugMode={true}>
                    <MainCommandBar></MainCommandBar>
                    <Tracks customItemActions={customItemActions}>
                    
                    </Tracks>
                </DndProvider>
            </ViewModelContext.Provider>
        </div>
    )
};

export default Agenda;
