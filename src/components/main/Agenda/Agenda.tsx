import React from 'react';
import AgendaViewModel from '../../../AgendaViewModel';
import ViewModelContext from '../../../ViewModelContext';
import { MainCommandBar } from '../MainCommandBar/MainCommandBarController';
import { Tracks } from '../Tracks/TracksController';
import styles from './Agenda.scss';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import cssVars from 'css-vars-ponyfill';

import { getPalette } from '../../../theme';




interface IProps {
    agendaViewModel: AgendaViewModel,
}

cssVars();

const colorPalette =  getPalette();

let themeObj = {}
Object.entries(colorPalette).forEach(([prop, value]) => { 
    themeObj['--' + prop] = value;
});

cssVars({
    variables:  themeObj
  });


const Agenda: React.FC<IProps> = ({ agendaViewModel }: IProps) => {

    return (
            <div className={styles.mainComponent}>
            <ViewModelContext.Provider value={agendaViewModel}>
                <DndProvider backend={HTML5Backend} debugMode={true}>
                    <MainCommandBar></MainCommandBar>
                    <Tracks></Tracks>
                </DndProvider>
            </ViewModelContext.Provider>
            </div>
    )
};

export default Agenda;
