import { observable, action, autorun, toJS } from 'mobx';
import { Item, Agenda, Day, Track } from '../types/types';
import moment from 'moment';


class AgendaModel {
    @observable agenda: Agenda = {
        startTime: moment('2013-02-08 7:00 '),
        endTime: moment('2013-02-08 18:00 '),
        days: [
            {
                date: moment('2013-02-08 8:00 '),
                dayId: "1",
                tracks: [
                    {
                        trackName: "",
                        trackId: "1",
                        items: [
                            {
                                itemId: "1",
                                start: moment('2013-02-08 8:00 '),
                                end: moment('2013-02-08 8:15'),
                                title: "Introduction",
                                speaker: "Team Lead"
                            },
                            {
                                itemId: "2",
                                start: moment('2013-02-08 8:15 '),
                                end: moment('2013-02-08 9:00'),
                                title: "Review Q1 - Team A",
                                speaker: "Team A Lead"
                            },
                            {
                                itemId: "3",
                                start: moment('2013-02-08 9:00 '),
                                end: moment('2013-02-08 9:30'),
                                title: "Review Q1 - Team B",
                                speaker: "Team B Lead"
                            }
                        ]
                    }
                ]
            },
            {
                date: moment('2013-02-09 8:00 '),
                dayId: "2",
                tracks: [
                    {
                        trackName: "",
                        trackId: "2",
                        items: [
                            {
                                itemId: "10",
                                start: moment('2013-02-08 8:00 '),
                                end: moment('2013-02-08 8:45'),
                                title: "Breakfast"
                            },
                            {
                                itemId: "11",
                                start: moment('2013-02-08 8:45 '),
                                end: moment('2013-02-08 9:30'),
                                title: "Presentation \"Design Thinking in 2018\"",
                                speaker: "Dr. Germione Hanger"
                            },
                            {
                                itemId: "12",
                                start: moment('2013-02-08 9:30 '),
                                end: moment('2013-02-08 9:45'),
                                title: "Coffee Break",
                            }
                        ]
                    }
                ]
            }]
    };

    @observable intervalPxHeight: number = 50;
    @observable intervalInMin: number = 15;
    @observable segmentFactor: number = 4;






    agendaHistory: Array<Agenda> = [];
    pointer: number = -1;

    constructor() {
        this.pushToHistory();
        autorun(() => console.log(toJS(this.agenda)));
    }

    @action addItem(item: Item, trackId: string) {
        const track: Track | undefined = this.getTrackById(trackId);
        if (track) {
            track.items.push(item);
            this.pushToHistory();
        }
    }



    @action setAgenda(agenda: Agenda) {
        this.agenda = agenda;
    }


    getDays() {
        return this.agenda.days;
    }

    getTracksByDay() {
        const foundDay: Day | undefined = this.agenda.days.find((day) => day.date === day.date);
        if (foundDay) {
            return foundDay.tracks;
        }
        return undefined;
    }

    getTrackById(id: string) {
        let days = this.agenda.days;
        for (let indexDays: number = 0; indexDays < days.length; indexDays++) {
            let tracks = days[indexDays].tracks;
            let foundTrack: Track | undefined = tracks.find((track: Track) => track.trackId === id);
            if (foundTrack) {
                return foundTrack;
            }
        }
        return undefined;
    }

    deleteItem(id: string) {
        let days = this.agenda.days;
        for (let indexDays: number = 0; indexDays < days.length; indexDays++) {
            let tracks: Array<Track> = days[indexDays].tracks;
            for (let indexTracks: number = 0; indexTracks < tracks.length; indexTracks++) {
                let foundIndex: number = tracks[indexTracks].items.findIndex((item: Item) => {
                    return item.itemId == id
                });
                if (foundIndex != -1) {
                    tracks[indexTracks].items.splice(foundIndex, 1);
                    this.pushToHistory();
                    return;
                }
            }
        }
    }


    getIntervalPxHeight() {
        return this.intervalPxHeight;
    }

    getIntervalInMin() {
        return this.intervalInMin;
    }

    getSegmentFactor() {
        return this.segmentFactor;
    }



    getStartTime() {
        return this.agenda.startTime;
    }

    getEndTime() {
        return this.agenda.endTime;
    }

    pushToHistory() {
        this.pointer++;
        this.agendaHistory.splice(this.pointer, this.agendaHistory.length);
        this.agendaHistory.push(toJS(this.agenda));
    }

    @action undo() {
        if (this.pointer > 0) {
            this.pointer--;
            this.setAgenda(this.agendaHistory[this.pointer]);
        }
    }

    @action redo() {
        if (this.pointer < this.agendaHistory.length - 1) {
            this.pointer++;
            this.setAgenda(this.agendaHistory[this.pointer]);
        }
    }

    // findItem(item: Item) {
    //     let foundItem: Item | undefined = this.items.find((curItem) => curItem.id === item.id);
    //     if (!foundItem) {
    //         throw new Error('Item not not found');
    //     }
    //     return foundItem;
    // }

}

export default AgendaModel;