import AgendaStore, { IItem, Item } from './models/AgendaStore';
import AgendaViewModelInterface from './interfaces/AgendaViewModelInterface';
import moment, { Moment, Duration } from 'moment';




class AgendaViewModel implements AgendaViewModelInterface {
    agendaStore: AgendaStore;

    constructor() {
        this.agendaStore = new AgendaStore();
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

    deleteItem(id: string, suppressPushToHistory?: boolean) {
        this.agendaStore.deleteItem(id);
        if (!suppressPushToHistory) this.pushToHistory();
    }

    addItem(item: IItem, trackId: string, suppressPushToHistory?: boolean) {
        this.agendaStore.addItem(new Item(item), trackId);
        this.agendaStore.getTrackById(trackId)!.sortItems();
        if (!suppressPushToHistory) {
            this.pushToHistory();
        }
    }

    updateItem(id: string, newProps: { title?: string, speaker?: string }, suppressPushToHistory?: boolean) {
        const item = this.agendaStore.getItem(id);
        if (item) {
            let changed = false;
            if (newProps.title !== undefined && newProps.title !== item.title) {
                item.title = newProps.title;
                changed = true;
            }
            if (newProps.speaker !== undefined && newProps.speaker !== item.speaker) {
                item.speaker = newProps.speaker;
                changed = true;
            }
            if (!suppressPushToHistory && changed) {
                this.pushToHistory();
            }
        }
    }



    moveItem(trackId: string, id: string, newStart: Moment) {
        //TODO: implement checks here
        const item = this.agendaStore.getItem(id);
        let curTrack = this.agendaStore.getTrackForItem(id);
        

        if (item && (curTrack!.id !== trackId)) {
            this.agendaStore.deleteItem(id);
            this.agendaStore.addItem(item, trackId);
            curTrack = this.agendaStore.getTrackById(trackId);
        }

        if (!item!.start.isSame(newStart) && curTrack) {
            const duration: Duration = moment.duration(item!.end.diff(item!.start));
            const newEnd = moment(newStart).add(duration);
          

            //1. find first colliding item
           
          
            //2. check if the colliding item's start or end time is closer
            
            //3. move item's starttime there
            item!.start = newStart;
            item!.end = newEnd;
            //3. move all items after that accordingly


        }

        if (curTrack) {
            curTrack.sortItems();
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
        if (item && !item.start.isSame(newStartTime)) {
            item.start = newStartTime;
        }
        //TODO: implement checks here/remove ?????
    }

    adjustItemEndTime(itemId: string, newEndTime: Moment) {
        // const item = this.agendaStore.getItem(itemId);
        const items = this.agendaStore.getItemAndFollowingItems(itemId);
        if (items) {
            const item = items[0];
            const nextItem = items[1];
            if (nextItem && nextItem.start.isSameOrBefore(item.end)) {
                const duration: Duration = moment.duration(newEndTime.diff(item.end));
                items.slice(1).forEach(curItem => {
                    const newStart = moment(curItem.start).add(duration);
                    const newEnd = moment(curItem.end).add(duration);
                    curItem!.start = newStart;
                    curItem!.end = newEnd;
                });
            }
            if (!item.end.isSame(newEndTime)) {
                item.end = newEndTime;
            }
        }


    }


    








}

export default AgendaViewModel;