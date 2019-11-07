import { observable, action, toJS } from 'mobx';
import moment from 'moment';
import {Item} from './ItemModel';
import {Track} from './TrackModel';
import {Day} from './DayModel';
import {Agenda, IAgenda} from './AgendaModel';


class MainModel {
    @observable agenda: Agenda = new Agenda({
        id: "1",
        startTime: moment('2013-02-08 7:00', 'YYYY-MM-DD H:mm'),
        endTime: moment('2013-02-08 18:00', 'YYYY-MM-DD H:mm'),
        days: [
            new Day({
                date: moment('2013-02-08 8:00', 'YYYY-MM-DD H:mm'),
                id: "1",
                tracks: [
                    new Track({
                        name: "",
                        id: "1",
                        items: [
                            new Item({
                                id: "1",
                                start: moment('2013-02-08 8:00', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 8:15', 'YYYY-MM-DD H:mm'),
                                title: "Introduction",
                                speaker: "Team Lead",
                            }),
                            new Item({
                                id: "2",
                                start: moment('2013-02-08 8:15', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 9:00', 'YYYY-MM-DD H:mm'),
                                title: "Review Q1 - Team A",
                                speaker: "Team A Lead"

                            }),
                            new Item({
                                id: "3",
                                start: moment('2013-02-08 9:00', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 9:30', 'YYYY-MM-DD H:mm'),
                                title: "Review Q1 - Team B",
                                speaker: "Team B Lead"
                            }),
                        ]
                    })
                ]
            }),
            new Day({
                date: moment('2013-02-09 8:00 '),
                id: "2",
                tracks: [
                    new Track({
                        name: "",
                        id: "2",
                        items: [
                            new Item({
                                id: "10",
                                start: moment('2013-02-08 8:00', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 8:45', 'YYYY-MM-DD H:mm'),
                                title: "Breakfast"
                            }),
                            new Item({
                                id: "11",
                                start: moment('2013-02-08 8:45', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 9:30', 'YYYY-MM-DD H:mm'),
                                title: "Presentation \"Design Thinking in 2018\"",
                                speaker: "Dr. Germione Hanger"
                            }),
                            new Item({
                                id: "12",
                                start: moment('2013-02-08 9:30', 'YYYY-MM-DD H:mm'),
                                end: moment('2013-02-08 9:45', 'YYYY-MM-DD H:mm'),
                                title: "Coffee Break",
                            })
                        ]
                    })
                ]
            })
        ]
    });

    @observable intervalPxHeight: number = 50;
    @observable intervalInMin: number = 15;
    @observable segmentFactor: number = 4;






    agendaHistory: Array<IAgenda> = [];
    pointer: number = -1;

    constructor() {
        this.pushToHistory();
    }

    @action addItem(item: Item, trackId: string) {
        const track: Track | undefined = this.getTrackById(trackId);
        if (track) {
            track.items.push(item);
        }
    }

    @action setAgenda(agenda: Agenda) {
        this.agenda = agenda;
    }

    @action setTitle(itemId: string, newTitle: string) {
        const item = this.getItem(itemId);
        if(item) {
            item.title = newTitle
        }
    }




    getDays() {
        return this.agenda.days;
    }

    getAgenda(): IAgenda {
        return this.agenda;
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
            let foundTrack: Track | undefined = tracks.find((track: Track) => track.id === id);
            if (foundTrack) {
                return foundTrack;
            }
        }
        return undefined;
    }

    getTrackForItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const item: Item | undefined = track.items.find((item) => item.id === id);
                if (item) {
                    return track;
                }
            }
        }
        return;
    }


    getItem(id: string) {
        //read only 
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const item: Item | undefined = track.items.find((item) => item.id === id);
                if (item) {
                    return item;
                }
            }
        }
        return undefined;
    }

    @action deleteItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const itemsTmp = track.items.filter((item) => item.id !== id)
                if (itemsTmp.length !== track.items.length) {
                    track.items = itemsTmp;
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
        console.log("pushing to history");
        this.pointer++;
        this.agendaHistory.splice(this.pointer, this.agendaHistory.length);
        this.agendaHistory.push(toJS(this.agenda));
    }

    @action undo() {
        if (this.pointer > 0) {
            this.pointer--;
            this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
        }
    }

    @action redo() {
        if (this.pointer < this.agendaHistory.length - 1) {
            this.pointer++;
            this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
        }
    }

}

export default MainModel;
export {Item, IItem} from './ItemModel';
export {Track, ITrack} from './TrackModel';
export {Day, IDay} from './DayModel';
export {Agenda, IAgenda} from './AgendaModel';