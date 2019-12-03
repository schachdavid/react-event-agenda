import AgendaStore, { IItem, Item } from './models/AgendaStore';
import { IAgendaViewModel } from './interfaces/IAgendaViewModel';
import moment, { Moment } from 'moment';
import UIStore, { UIState } from './models/UIStore';
import { ItemUIState } from './models/ItemModel';
import uuid from 'uuid';
import { IAgendaJSON, Agenda } from './models/AgendaModel';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';






export class AgendaViewModel implements IAgendaViewModel {
    agendaStore: AgendaStore;
    uiStore: UIStore;
    handleDataChange: ((() => void) & Cancelable) | undefined;

    constructor(data: IAgendaJSON, handleDataChange?: (data: IAgendaJSON) => void) {
        this.agendaStore = new AgendaStore(data);
        this.uiStore = new UIStore();
        this.handleDataChange = handleDataChange ? debounce(() => handleDataChange(this.getData()), 500) : undefined;
    }

    setData(data: IAgendaJSON) {
        data.days.forEach(day => {
            day.tracks.forEach(track => {
                track.items.forEach(item => {
                    item.uiState = undefined;
                })
            })  
        });
        this.agendaStore.setAgenda(Agenda.fromJSON(data));
        this.agendaStore.overWriteCurrentHistoryEntry();
    }

    getData() {
        const data = this.agendaStore.agenda.toJSON();
        data.days.forEach(day => {
            day.tracks.forEach(track => {
                track.items.forEach(item => {
                    item.uiState = undefined;
                })
            })  
        });
        return data;
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



    getDays(filter?: { uiHidden?: boolean },) {
        return this.agendaStore.getDays(filter);
    }
 

    getDayForTrack(trackId: string) {
        return this.agendaStore.getDayForTrack(trackId);
    }

    getDayForItem(id: string) {
        return this.agendaStore.getDayForItem(id);
    }

    setDayUiHidden(id: string, value: boolean) {
        const day = this.agendaStore.getDay(id);
        if (day) {
            day.uiHidden = value;
        }
    }

    getItem(id: string): IItem | undefined {
        return this.agendaStore.getItem(id);
    }

    getItems(filter?: { uiState?: ItemUIState }, itemIds?: Array<string>) {
        return this.agendaStore.getItems(filter, itemIds);
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

        this.agendaStore.getItems().forEach(item => {
            if (shouldSelect) {
                item.uiState = ItemUIState.Selected;
            };
            if (item.id === itemId || item.id === lastSelectedId) {
                shouldSelect = !shouldSelect;
                item.uiState = ItemUIState.Selected;
            }
        })
        this.agendaStore.overWriteCurrentHistoryEntry();
    }


    deleteItem(id: string, suppressPushToHistory?: boolean) {
        this.agendaStore.deleteItem(id);
        if (!suppressPushToHistory) this.pushToHistory();
    }

    addItem(item: IItem, trackId: string, suppressPushToHistory?: boolean) {
        this.agendaStore.addItem(new Item(item), trackId);
        this.agendaStore.getTrack(trackId)!.sortItems();
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
            const oldState =  item.uiState ;
            item.uiState = newUIState;
            if (newUIState === ItemUIState.Selected ||  oldState === ItemUIState.Selected ||  oldState === ItemUIState.Editing) {
                this.agendaStore.overWriteCurrentHistoryEntry();                
            }
            
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


    moveItems(trackId: string, clickedId: string, newStart: Moment, itemIds: Array<string>) {
        // TODO: check if items are still on the tracks start and end time
        const itemsToMove = this.agendaStore.getItems(undefined, itemIds);
        let totalDuration = 0;


        itemsToMove.forEach(item => {
            let track = this.agendaStore.getTrackForItem(item.id);
            if (!track) return;
            let items = track.items;
            if (!items) return;
            const itemIndex = track.items.findIndex(curItem => curItem.id === item.id);

            //check if currently the item is between two others which are not currently moved and if so cut it out
            if (itemIndex + 1 < items.length &&
                items[itemIndex + 1].start.isSame(item.end) &&
                !itemIds.includes(items[itemIndex + 1].id) &&
                itemIndex - 1 >= 0 &&
                items[itemIndex - 1].end.isSame(item.start) &&
                !itemIds.includes(items[itemIndex - 1].id) &&
                !(itemsToMove.length <= 1 && item.start.isSame(newStart))
            ) {
                this.moveItemsForced(items.slice(itemIndex + 1), (item.start.diff(item.end)));
            }

            //check if the track has changed and if so move the item there
            if (item && (track.id !== trackId)) {
                this.agendaStore.deleteItem(item.id);
                this.agendaStore.addItem(item, trackId);
            }

            //add item duration to total duration of itemsToMove
            
            totalDuration = totalDuration + item.end.diff(item.start);
        })

        let curTrack = this.agendaStore.getTrackForItem(clickedId);

        if (!curTrack) return;

        let items = curTrack.items;
        if (!items) return;

        const timeLineStart = this.getTimeLineStartTime(items[0].start);


        const movedItemsDummy = new Item({ id: uuid(), start: moment(newStart), end: moment(newStart).add(totalDuration) })



        //collision checking:
        if (movedItemsDummy && curTrack) {
            //1. find first colliding item
            const overlappingItemIndex = items.findIndex((curItem: Item) => {
                return ((curItem.start.isSameOrAfter(movedItemsDummy.start) && curItem.start.isBefore(movedItemsDummy.end) ||
                    curItem.end.isAfter(movedItemsDummy.start) && curItem.end.isSameOrBefore(movedItemsDummy.end) ||
                    movedItemsDummy.start.isSameOrAfter(curItem.start) && movedItemsDummy.start.isBefore(curItem.end) ||
                    movedItemsDummy.end.isAfter(curItem.start) && movedItemsDummy.end.isSameOrBefore(curItem.end))
                ) && !itemIds.includes(curItem.id)
            })

            if (overlappingItemIndex !== -1) {
                const overlappingItem = items[overlappingItemIndex];
                //2. check if the colliding item's start or end time is closer
                const movedItemMiddle = moment(movedItemsDummy.start).add(movedItemsDummy.end.diff(movedItemsDummy.start) / 2);
                const overlappingItemMiddle = moment(overlappingItem.start).add(overlappingItem.end.diff(overlappingItem.start) / 2);

                if (movedItemMiddle.isSameOrAfter(overlappingItemMiddle) || moment(overlappingItem.start).subtract(totalDuration).isBefore(timeLineStart)) {
                    //3. move items there
                    movedItemsDummy.start = moment(overlappingItem.end);
                    movedItemsDummy.end = moment(movedItemsDummy.start).add(totalDuration);
                    //4. move all items after that accordingly
                    if (overlappingItemIndex + 1 < items.length) {
                        //find the item which is the next and nearest but not being moved currently
                        let nextItem = items[overlappingItemIndex + 1];
                        let shouldMove = !itemIds.includes(nextItem.id);

                        for (let iOffset = + 2; overlappingItemIndex + iOffset < items.length && itemIds.includes(nextItem.id); iOffset--) {
                            nextItem = items[overlappingItemIndex + iOffset];
                            shouldMove = true;
                            if (overlappingItemIndex + iOffset >= items.length - 1) shouldMove = false;
                        }
                        if (shouldMove && movedItemsDummy.end.isAfter(nextItem.start)) {
                            const moveMilSec = movedItemsDummy.end.diff(nextItem.start)
                            const otherItemsToMove = items.slice(overlappingItemIndex + 1).filter(curItem => !itemIds.includes(curItem.id))
                            this.moveItemsForced(otherItemsToMove, moveMilSec);
                        }
                    }
                } else {
                    //3. move items there
                    movedItemsDummy.end = moment(overlappingItem.start);
                    movedItemsDummy.start = moment(movedItemsDummy.end).subtract(totalDuration)
                    //4. move all items after that accordingly
                    if (overlappingItemIndex - 1 >= 0) {
                        //find the item which is the previous and nearest but not being moved currently
                        let previousItem = items[overlappingItemIndex - 1];
                        let shouldMove = !itemIds.includes(previousItem.id);
                        for (let iOffset = -2; overlappingItemIndex + iOffset >= 0 && itemIds.includes(previousItem.id); iOffset--) {
                            previousItem = items[overlappingItemIndex + iOffset];
                            shouldMove = true;
                            if (overlappingItemIndex + iOffset <= 0) shouldMove = false;
                        }
                        if (shouldMove && movedItemsDummy.start.isBefore(previousItem.end)) {
                            const moveMilSec = previousItem.end.diff(movedItemsDummy.start);
                            const otherItemsToMove = items.slice(overlappingItemIndex).filter(curItem => !itemIds.includes(curItem.id));
                            // this.moveItemForced(item, moveMilSec);
                            movedItemsDummy.end.add(moveMilSec);
                            movedItemsDummy.start.add(moveMilSec);
                            this.moveItemsForced(otherItemsToMove, moveMilSec);
                        }
                    }
                }
            } else {
                movedItemsDummy.start = moment(newStart);
                movedItemsDummy.end = moment(newStart).add(totalDuration);
            }

            //insert the actual items at the dummy's position
            let startTimeToInsert = moment(movedItemsDummy.start);
            itemsToMove.forEach(item => {
                const itemDuration = item.end.diff(item.start);
                item.start = moment(startTimeToInsert);
                item.end = moment(item.start).add(itemDuration);
                startTimeToInsert.add(itemDuration);
            });
        }

        if (curTrack) {
            curTrack.sortItems();
        }
    }

    

    unselectAll() {
        this.agendaStore.getItems({ uiState: ItemUIState.Selected }).forEach(item => {
            item.uiState = undefined;
        })
        this.agendaStore.overWriteCurrentHistoryEntry();
        this.updateUIState(UIState.Normal);
        this.clearSelectHistory();
    }

    undo(keepItemUIState?: boolean, suppressDataChangeHandling?: boolean) {
        this.agendaStore.undo();
        if (!keepItemUIState) {
            this.agendaStore.getItems().forEach(item => {
                item.uiState = undefined;
            })
        }
        if(this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
    }

    redo(keepItemUIState?: boolean, suppressDataChangeHandling?: boolean) {
        this.agendaStore.redo();
        if (!keepItemUIState) {
            this.agendaStore.getItems().forEach(item => {
                item.uiState = undefined;
            })
        }
        if(this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
    }

    pushToHistory(suppressDataChangeHandling?: boolean) {
        this.agendaStore.pushToHistory();
        if(this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
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

