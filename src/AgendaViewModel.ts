import AgendaStore, { IItem, Item } from './models/AgendaStore';
import AgendaViewModelInterface from './interfaces/AgendaViewModelInterface';
import moment, { Moment, Duration } from 'moment';




export class AgendaViewModel implements AgendaViewModelInterface {
    agendaStore: AgendaStore;

    constructor() {
        this.agendaStore = new AgendaStore();
    }


    getStore() {
        return this.agendaStore;
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

    getDayForTrack(trackId: string) {
        return this.agendaStore.getDayForTrack(trackId);
    }

    getDayForItem(id: string) {
        return this.agendaStore.getDayForItem(id);
    }



    getTimeLineStartTime(dateToSet?: Moment) {
        const days = this.getDays();
        const date = dateToSet ? moment(dateToSet) : days[0].startTime;
        if (date) {
            const startTimes = days.map(day => {
                const currentTime = moment(day.startTime);
                currentTime.set({
                    'date': date.get('date'),
                    'month': date.get('month'),
                    'year': date.get('year')
                });
                return currentTime;
            });
            return moment.min(startTimes);
        }
        return;
    }

    getTimeLineEndTime(dateToSet?: Moment) {
        const days = this.getDays();
        const date = dateToSet ? moment(dateToSet) : days[0].startTime;
        if (date) {
            const endTimes = days.map(day => {
                const currentTime = moment(day.endTime);
                currentTime.set({
                    'date': date.get('date'),
                    'month': date.get('month'),
                    'year': date.get('year')
                });
                return currentTime;
            });
            return moment.max(endTimes);
        }
        return;
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


    moveItemsForced(items: Array<Item>, duration: Duration) {
        items.forEach(curItem => {
            const newStart = moment(curItem.start).add(duration);
            const newEnd = moment(curItem.end).add(duration);
            curItem!.start = newStart;
            curItem!.end = newEnd;
        });
    }






    moveItem(trackId: string, id: string, newStart: Moment) {

        const items = this.agendaStore.getItemAndFollowingItems(id);
        if(!items) return;

        const item = items[0];


        if(items[1].start.isSame(item.end)) {

        }



        let curTrack = this.agendaStore.getTrackForItem(id);

        if (item && (curTrack!.id !== trackId)) {
            this.agendaStore.deleteItem(id);
            this.agendaStore.addItem(item, trackId);
            curTrack = this.agendaStore.getTrackById(trackId);
        } else if (item && item.start.isSame(newStart)) return;


        //collision checking:
        if (item && curTrack) {
            // console.log(item.start.format('DD.MM.YYYY HH:mm'), newStart.format('DD.MM.YYYY HH:mm'));

            const itemDuration: Duration = moment.duration(item!.end.diff(item!.start));
            const newEnd = moment(newStart).add(itemDuration);
            const items = curTrack.items;
            const movedItem = new Item(item.toJSON());
            movedItem.start = newStart;
            movedItem.end = newEnd;

            //TODO: move overlapping checking in seperate function

            //1. find first colliding item
            const overlappingItemIndex = items.findIndex((curItem: Item) => {
                return (curItem.start.isSameOrAfter(movedItem.start) && curItem.start.isBefore(movedItem.end) ||
                    curItem.end.isAfter(movedItem.start) && curItem.end.isSameOrBefore(movedItem.end) ||
                    movedItem.start.isSameOrAfter(curItem.start) && movedItem.start.isBefore(curItem.end) ||
                    movedItem.end.isAfter(curItem.start) && movedItem.end.isSameOrBefore(curItem.end)) && movedItem.id !== curItem.id
            })

            const overlappingItem = items[overlappingItemIndex];

            if (overlappingItem) {
                //2. check if the colliding item's start or end time is closer
                const movedItemMiddle = moment(movedItem.start).add(movedItem.end.diff(movedItem.start) / 2);
                const overlappingItemMiddle = moment(overlappingItem.start).add(overlappingItem.end.diff(overlappingItem.start) / 2);

                if (movedItemMiddle.isSameOrAfter(overlappingItemMiddle)) {
                    //3. move item's starttime there
                    item.start = overlappingItem.end;
                    item.end = moment(item.start).add(itemDuration);
                    //4. move all items after that accordingly
                    const otherItemsToMove = items.slice(overlappingItemIndex + 1).filter(curItem => curItem.id !== item.id)
                    this.moveItemsForced(otherItemsToMove, itemDuration);

                } else {
                    //3. move item's starttime there
                    item.start = overlappingItem.start;
                    item.end = moment(item.start).add(itemDuration);
                    //4. move all items after that accordingly
                    const otherItemsToMove = items.slice(overlappingItemIndex).filter(curItem => curItem.id !== item.id)
                    this.moveItemsForced(otherItemsToMove, itemDuration);
                }
            } else {
                item!.start = newStart;
                item!.end = newEnd;
            }

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
                this.moveItemsForced(items.slice(1), duration)
            }
            if (!item.end.isSame(newEndTime)) {
                item.end = newEndTime;
            }
        }

    }












}

