import React from 'react';
// import ListController from './components/List/ListController';
import AgendaViewModel from '../../../AgendaViewModel';
import ViewModelContext from '../../../ViewModelContext';
// import ListView from './components/List/ListView';
import { MainCommandBar } from '../MainCommandBar/MainCommandBarController';
import { Tracks } from '../Tracks/TracksController';
import { CssProvider } from '../../utilComponents/CssProvider/CssProvider';
import { getRGBPalette } from '../../../theme';
import globalStyles from '../../../globalStyles.scss';
import styles from './Agenda.module.scss';
import classNames from 'classnames';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'



interface IProps {
    agendaViewModel: AgendaViewModel,
}

const Agenda: React.FC<IProps> = ({ agendaViewModel }: IProps) => {

    return (
        <CssProvider
            theme={getRGBPalette()}
            className={classNames(styles.fullWH, globalStyles.globalStyles)}>
            <ViewModelContext.Provider value={agendaViewModel}>
                <DndProvider backend={HTML5Backend} debugMode={true}>
                    <MainCommandBar></MainCommandBar>
                    <Tracks></Tracks>
                </DndProvider>
            </ViewModelContext.Provider>
        </CssProvider>
    )
};

export default Agenda;
