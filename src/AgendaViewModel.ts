import AgendaStore, { IItem, Item } from './models/AgendaStore';
import AgendaViewModelInterface from './interfaces/AgendaViewModelInterface';
import moment, { Moment, Duration } from 'moment';
import UIStore, { UIState } from './models/UIStore';
import { ItemUIState } from './models/ItemModel';
import { inject, getSnapshot, applySnapshot, ViewModel } from 'mmlpx'
import { action } from 'mobx';




@ViewModel
export class AgendaViewModel implements AgendaViewModelInterface {
    @inject(AgendaStore) agendaStore: AgendaStore;
    uiStore: UIStore;

    pointer: number = -1;
    stack: any[] = [];


    constructor() {
        this.agendaStore = new AgendaStore();
        this.uiStore = new UIStore();
        this.pushToHistory();
    }

    getUIState() {
        return this.uiStore.getUiState();
    }

    updateUIState(newState: UIState) {
        this.uiStore.setUiState(newState);
    }

    getAgendaStore() {
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

    getItem(id: string): IItem | undefined {
        return this.agendaStore.getItem(id);
    }

    getSelectedItems(): Array<IItem> {
        return this.agendaStore.getSelectedItems();
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

    pushToSelectHistory(itemId: string) {
        this.uiStore.getSelectHistory().push(itemId);
    }

    deleteFromSelectHistory(itemId: string) {
        this.uiStore.setSelectHistory(this.uiStore.getSelectHistory().filter(
            id => id !== itemId
        ));
    }

    clearSelectHistory() {
        this.uiStore.setSelectHistory([]);
    }


    selectItemsWithShift(itemId: string) {
        const selectHistory = this.uiStore.getSelectHistory();
        const lastSelectedId = selectHistory[selectHistory.length - 1];

        let shouldSelect = false;

        this.agendaStore.getAllItems().forEach(item => {
            if (shouldSelect) {
                item.uiState = ItemUIState.Selected;
            };
            if (item.id === itemId || item.id === lastSelectedId) {
                shouldSelect = !shouldSelect;
                item.uiState = ItemUIState.Selected;
            }
        })
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

    updateItemUIState(id: string, newUIState: ItemUIState | undefined) {
        const item = this.agendaStore.getItem(id);
        if (item) {
            item.uiState = newUIState;
        }
    }


    moveItemsForced(items: Array<Item>, milSecToMove: number) {
        items.forEach(curItem => {
            const newStart = moment(curItem.start).add(milSecToMove);
            const newEnd = moment(curItem.end).add(milSecToMove);
            curItem!.start = newStart;
            curItem!.end = newEnd;
        });
    }

    moveItemForced(item: Item, milSecToMove: number) {
        this.moveItemsForced([item], milSecToMove);
    }


    moveItem(trackId: string, id: string, newStart: Moment) {

        let curTrack = this.agendaStore.getTrackForItem(id);

        if (!curTrack) return;

        let items = curTrack.items;
        const itemIndex = curTrack.items.findIndex(item => item.id === id);

        // const items = this.agendaStore.getItemAndFollowingItems(id);
        if (!items) return;

        const item = items[itemIndex];


        //check if currently the item is between to others and needs to be cut out
        if (itemIndex + 1 < items.length &&
            items[itemIndex + 1].start.isSame(item.end) &&
            itemIndex - 1 >= 0 &&
            items[itemIndex - 1].end.isSame(item.start) &&
            !item.start.isSame(newStart)) {
            this.moveItemsForced(items.slice(itemIndex + 1), (item.start.diff(item.end)));
        }

        //check if the track has changed
        if (item && (curTrack!.id !== trackId)) {
            this.agendaStore.deleteItem(id);
            this.agendaStore.addItem(item, trackId);
            curTrack = this.agendaStore.getTrackById(trackId);
            if (curTrack) {
                items = curTrack.items;
            }
        } else if (item && item.start.isSame(newStart)) return;


        //collision checking:
        if (item && curTrack) {
            const itemDuration: Duration = moment.duration(item!.end.diff(item!.start));
            const newEnd = moment(newStart).add(itemDuration);
            const movedItem = new Item(item.toJSON());
            movedItem.start = newStart;
            movedItem.end = newEnd;

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
                    //3. move item there
                    item.start = moment(overlappingItem.end);
                    item.end = moment(item.start).add(itemDuration);
                    //4. move all items after that accordingly
                    if (overlappingItemIndex + 1 < items.length) {
                        let nextOverlappingItem = items[overlappingItemIndex + 1];
                        //edge case nextOverlapping Item is the item to move
                        let shouldMove = true;
                        if (nextOverlappingItem === item) {
                            if (overlappingItemIndex + 2 < items.length) {
                                nextOverlappingItem = items[overlappingItemIndex + 2];
                            } else {
                                shouldMove = false;
                            }
                        }
                        if (shouldMove && item.end.isAfter(nextOverlappingItem.start)) {
                            const moveMilSec = item.end.diff(nextOverlappingItem.start)
                            const otherItemsToMove = items.slice(overlappingItemIndex + 1).filter(curItem => curItem.id !== item.id)
                            this.moveItemsForced(otherItemsToMove, moveMilSec);
                        }
                    }
                } else {
                    //3. move item there
                    item.end = moment(overlappingItem.start);
                    item.start = moment(item.end).subtract(itemDuration)
                    //4. move all items after that accordingly
                    if (overlappingItemIndex - 1 >= 0) {
                        let previousOverlappingItem = items[overlappingItemIndex - 1];
                        //edge case perviousOverlapping Item is the item to move
                        let shouldMove = true;
                        if (previousOverlappingItem === item) {
                            if (overlappingItemIndex - 2 >= 0) {
                                previousOverlappingItem = items[overlappingItemIndex - 2];
                            } else {
                                shouldMove = false;
                            }
                        }
                        if (shouldMove && item.start.isBefore(previousOverlappingItem.end)) {
                            const moveMilSec = previousOverlappingItem.end.diff(item.start);
                            const otherItemsToMove = items.slice(overlappingItemIndex).filter(curItem => curItem.id !== item.id);
                            this.moveItemForced(item, moveMilSec);
                            this.moveItemsForced(otherItemsToMove, moveMilSec);
                        }
                    }


                }
            } else {
                item!.start = moment(newStart);
                item!.end = moment(newEnd);
            }

        }

        if (curTrack) {
            curTrack.sortItems();
        }
    }

    unselectAll() {
        this.agendaStore.getSelectedItems().forEach(item => {
            item.uiState = undefined;
        })
        this.updateUIState(UIState.Normal);
        this.clearSelectHistory();
    }

    // @action undo() {
    //     if (this.pointer > 0) {
    //         this.pointer--;
    //         this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
    //     }
    // }

    // @action redo() {
    //     if (this.pointer < this.agendaHistory.length - 1) {
    //         this.pointer++;
    //         this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
    //     }
    // }



    @action
    undo() {
        // this.agendaStore.undo();
        if (this.pointer > 0) {
            this.pointer--;
            applySnapshot(this.stack[this.pointer])
        }
    }

    @action
    redo() {
        // this.agendaStore.redo();
        if (this.pointer < this.stack.length - 1) {
            this.pointer++;
            applySnapshot((this.stack[this.pointer]));
        }
    }

    pushToHistory() {
        // this.agendaStore.pushToHistory()
        this.pointer++;
        this.stack.splice(this.pointer, this.stack.length);
        this.stack.push(getSnapshot());
    }

    adjustItemStartTime(itemId: string, newStartTime: Moment) {
        const track = this.agendaStore.getTrackForItem(itemId);
        const items = track && track.items ? track.items : undefined;

        if (items) {
            const index = items.findIndex(curItem => curItem.id === itemId);
            const item = items[index];
            if (index - 1 >= 0 && items[index - 1].end.isAfter(newStartTime)) return;
            if (item && !item.start.isSame(newStartTime)) {
                item.start = newStartTime;
            }
        }
        //TODO: implement checks here/remove ?????
    }

    adjustItemEndTime(itemId: string, newEndTime: Moment) {
        // const item = this.agendaStore.getItem(itemId);
        const items = this.agendaStore.getItemAndFollowingItems(itemId);
        if (items) {
            const item = items[0];
            if (newEndTime.isSameOrBefore(item.start)) return;
            const nextItem = items[1];
            if (nextItem && nextItem.start.isSameOrBefore(item.end)) {
                this.moveItemsForced(items.slice(1), newEndTime.diff(item.end))
            }
            if (!item.end.isSame(newEndTime)) {
                item.end = newEndTime;
            }
        }

    }












}

