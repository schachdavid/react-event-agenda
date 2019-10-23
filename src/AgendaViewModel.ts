import ItemsModel from './models/AgendaModel';
import UIModel from './models/UIModel';
import AgendaViewModelInterface from './interfaces/AgendaViewModelInterface';
import moment, { Moment, Duration } from 'moment';
// import ListItem from './types/dataTypes';
// import { action } from 'mobx';



class AgendaViewModel implements AgendaViewModelInterface {
    itemsStore: ItemsModel;
    uiStore: UIModel;

    constructor() {
        this.itemsStore = new ItemsModel();
        this.uiStore = new UIModel();
    }

    getStore() {
        return this.itemsStore;
    }

    getStartTime() {
        return this.itemsStore.getStartTime();

    }

    getEndTime() {
        return this.itemsStore.getEndTime();
    }

    getIntervalPxHeight() {
        return this.itemsStore.getIntervalPxHeight();
    }

    getIntervalInMin() {
        return this.itemsStore.getIntervalInMin();
    }

    getSegmentFactor() {
        return this.itemsStore.getSegmentFactor();
    }

    getDays() {
        return this.itemsStore.getDays();
    }

    deleteItem(itemId: string) {
        this.itemsStore.deleteItem(itemId);
    }

    addItem() {
        // this.itemsStore.addItem(listItem);
    }

    moveItem(trackId: string, itemId: string, newStart: Moment) {
        const item = this.itemsStore.getItem(itemId);
        const curTrack = this.itemsStore.getTrackForItem(itemId);
        if (item &&( curTrack!.trackId !== trackId) || !item!.start.isSame(newStart)) {
            const duration: Duration = moment.duration(item!.end.diff(item!.start));
            const newEnd = moment(newStart).add(duration);
            item!.start = newStart;
            item!.end = newEnd;
            if (item && curTrack!.trackId !== trackId) {
                this.itemsStore.deleteItem(itemId)
                this.itemsStore.addItem(item, trackId);
            }
        }
    }

    undo() {
        this.itemsStore.undo();
    }

    redo() {
        this.itemsStore.redo();
    }

    pushToHistory() {
        this.itemsStore.pushToHistory()
    }








}

export default AgendaViewModel;