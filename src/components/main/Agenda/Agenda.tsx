import React from 'react';
// import ListController from './components/List/ListController';
import AgendaViewModel from '../../../AgendaViewModel';
import ViewModelContext from '../../../ViewModelContext';
// import ListView from './components/List/ListView';
import MainCommandBarController from '../MainCommandBar/MainCommandBarController';
import MainCommandBarView from '../MainCommandBar/MainCommandBarView';
import TracksController from '../Tracks/TracksController';
import TracksView from '../Tracks/TracksView';
import { CssProvider } from '../../util/CssProvider/CssProvider';
import { getRGBPalette } from '../../../theme';
import globalStyles from '../../../globalStyles.scss';
import styles from './Agenda.module.scss';
import classNames from 'classnames';



interface IProps {
    agendaViewModel: AgendaViewModel,
}

const Agenda: React.FC<IProps> = ({ agendaViewModel }: IProps) => {


    return (
        <CssProvider
            theme={getRGBPalette()}
            className={classNames(styles.fullWH, globalStyles.globalStyles)}>
            <ViewModelContext.Provider value={agendaViewModel}>
                <MainCommandBarController>
                    {() => <MainCommandBarView />}
                </MainCommandBarController>
                <TracksController>
                    {({ tracks, handleWidthChange, singleTrack }) => <TracksView
                        tracks={tracks}
                        handleWidthChange={handleWidthChange}
                        singleTrack={singleTrack} />}
                </TracksController>
            </ViewModelContext.Provider>
        </CssProvider>
    )
};

export default Agenda;
