import MainModel, { IItem, Item } from './models/MainModel';
import AgendaViewModelInterface from './interfaces/AgendaViewModelInterface';
import moment, { Moment, Duration } from 'moment';




class AgendaViewModel implements AgendaViewModelInterface {
    agendaStore: MainModel;

    constructor() {
        this.agendaStore = new MainModel();
    }

    getStore() {
        return this.agendaStore;
    }

    getStartTime() {
        return this.agendaStore.getStartTime();
    }

    getEndTime() {
        return this.agendaStore.getEndTime();
    }

    getIntervalPxHeight() {
        return this.agendaStore.getIntervalPxHeight();
    }

    getIntervalInMin() {
        return this.agendaStore.getIntervalInMin();
    }

    getSegmentFactor() {
        return this.agendaStore.getSegmentFactor();
    }

    getDays() {
        return this.agendaStore.getAgenda().days;
    }

    deleteItem(id: string) {
        this.agendaStore.deleteItem(id);
    }

    addItem(item: IItem, trackId: string) {
        const track = this.agendaStore.getTrackById(trackId);
        if(track) {
            track.items.push(new Item(item))
        }
    }


    moveItem(trackId: string, id: string, newStart: Moment) {
        //TODO: implement checks here
        const item = this.agendaStore.getItem(id);
        const curTrack = this.agendaStore.getTrackForItem(id);
        if (item && (curTrack!.id !== trackId) || !item!.start.isSame(newStart)) {
            const duration: Duration = moment.duration(item!.end.diff(item!.start));
            const newEnd = moment(newStart).add(duration);
            item!.start = newStart;
            item!.end = newEnd;
            if (item && curTrack!.id !== trackId) {
                this.agendaStore.deleteItem(id)
                this.agendaStore.addItem(item, trackId);
            }
        }
    }

    undo() {
        this.agendaStore.undo();
    }

    redo() {
        this.agendaStore.redo();
    }

    pushToHistory() {
        this.agendaStore.pushToHistory()
    }

    adjustItemStartTime(itemId: string, newStartTime: Moment) {
        const item = this.agendaStore.getItem(itemId);
        if (item) {
            item.start = newStartTime;
        }
        //TODO: implement checks here
    }

    adjustItemEndTime(itemId: string, newEndTime: Moment) {
        const item = this.agendaStore.getItem(itemId);
        if (item) {
            item.end = newEndTime;
        }
        //TODO: implement checks here
    }








}

export default AgendaViewModel;