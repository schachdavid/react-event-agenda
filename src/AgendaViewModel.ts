/**
 * The Central AgendaViewModel.
 *
 * @file The AgendaViewModel is the central API for interacting with the react-event-agenda component. 
 * The UI reacts to all changes made using the ViewModel's methods. The AgendaViewModel is also used 
 * internally to glue everything together. ViewModels are part of the Model View ViewModel (MVVM)
 * Design Pattern.
 * 
 * @license MIT
 */

import AgendaStore, { IItem, Item, Day } from './models/AgendaStore';
import moment, { Moment } from 'moment';
import UIStore, { UIState } from './models/UIStore';
import { ItemUIState } from './models/ItemModel';
import uuid from 'uuid';
import { IAgendaJSON, Agenda } from './models/AgendaModel';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';
import findLastIndex from 'lodash/findLastIndex'
import { IDayJSON, IDay } from './models/DayModel';



export class AgendaViewModel {
    agendaStore: AgendaStore;
    uiStore: UIStore;
    handleDataChange: ((() => void) & Cancelable) | undefined;

    /**
     * The AgendaViewModel is the central API for interacting with the react-event-agenda component. 
     * The UI reacts to all changes made using the ViewModel's methods.
     * 
     * @param {IAgendaJSON} data - initial Data
     * @param {(data: IAgendaJSON) => void} handleDataChange - this function gets called whenever the user changes the agenda, it is debounced.
     * 
     * @example const agendaViewModel = new AgendaViewModel(initialData, data => saveToDB(data));
     */
    constructor(data: IAgendaJSON, handleDataChange?: (data: IAgendaJSON) => void) {
        this.agendaStore = new AgendaStore(data);
        this.uiStore = new UIStore();
        this.handleDataChange = handleDataChange ? debounce(() => handleDataChange(this.getData()), 500) : undefined;
    }


    /**
     * Sets the given JSON data for the agenda.
     * 
     * @param {IAgendaJSON} data 
     */
    setData(data: IAgendaJSON) {
        const prunedData = this.pruneItemUIState(data);
        this.agendaStore.setAgenda(Agenda.fromJSON(prunedData));
        this.agendaStore.overWriteCurrentHistoryEntry();
    }

    /**
     * Gets the current agenda data.
     * 
     * @return {IAgendaJSON} the current agenda data
     */
    getData(): IAgendaJSON {
        const data = this.agendaStore.agenda.toJSON();
        const prunedData = this.pruneItemUIState(data);
        return prunedData;
    }

    private pruneItemUIState(data: IAgendaJSON) {
        data.days.forEach(day => {
            day.tracks.forEach(track => {
                track.items.forEach(item => {
                    item.uiState = undefined;
                })
            })
        });
        return data;
    }


    /**
     * Gets the UIState. The UIState shows which kind of action the user is currently performing.
     * 
     * @return {UIState} the current agenda data
     */
    getUIState(): UIState {
        return this.uiStore.getUiState();
    }

    /**
     * Updates the UIState.
     * 
     * @param {UIState} newState 
     */
    updateUIState(newState: UIState) {
        this.uiStore.setUiState(newState);
    }

    /**
     *  Gets the agenda's store. In general you should not access the store directly. 
     *  Use the Viewmodels methods instead.
     * 
     * @return {AgendaStore} the agenda's store
     */
    getAgendaStore(): AgendaStore {
        return this.agendaStore;
    }

    /**
     * The intervalPXHeight is the height in px of one interval. 
     * An interval is the number of minutes the items snap to in th UI.
     * 
     * @return {number}
     */
    getIntervalPxHeight(): number {
        return this.agendaStore.getIntervalPxHeight();
    }

    /**
     * The number of minutes which are one interval. 
     * The items are snapping to the intervals in the UI. 
     * 
     * @return {number}
     */
    getIntervalInMin(): number {
        return this.agendaStore.getIntervalInMin();
    }

    /**
     * The number of intervals which one segment contains.
     * 
     * @return {number}
     */
    getSegmentFactor(): number {
        return this.agendaStore.getSegmentFactor();
    }

    /**
     * 
     * @return {IDay[]}
     */
    getDays(filter?: { uiHidden?: boolean }): IDay[] {
        return this.agendaStore.getDays(filter);
    }

    /**
     * 
     * @param id - the ID of the day to delete
     */
    deleteDay(id: string) {
        this.agendaStore.deleteDay(id);
    }

    /**
     * 
     * @param day - the day to add.
     */
    addDay(day: IDayJSON) {
        this.agendaStore.addDay(new Day(day));
    }

    /**
     * Gets the day which holds the track with the given ID.
     * Returns undefined if no day has been found.
     * 
     * @param trackId 
     * @return {IDay | undefined}
     */
    getDayForTrack(trackId: string): IDay | undefined {
        return this.agendaStore.getDayForTrack(trackId);
    }

    /**
     * 
     * @param id 
     */
    getDayForItem(id: string): IDay | undefined {
        return this.agendaStore.getDayForItem(id);
    }

    /**
     * Hides or reveals the given day. Used for pagination.
     * 
     * @param id 
     * @param value 
     */
    setDayUiHidden(id: string, value: boolean) {
        const day = this.agendaStore.getDay(id);
        if (day) {
            day.uiHidden = value;
        }
    }


    getItem(id: string): IItem | undefined {
        return this.agendaStore.getItem(id);
    }

    getItems(filter?: { uiState?: ItemUIState }, itemIds?: Array<string>): IItem[] {
        return this.agendaStore.getItems(filter, itemIds);
    }

    /**
     * Gets the timelines startTime which is the earliest start time from all days.
     * If dateToSet given moves its day there.
     * 
     * @param dateToSet - the day to move the start time to
     * @return {Moment | undefined}
     */
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

    /**
     * Gets the timelines startTime which is the latest end time from all days.
     * If dateToSet given moves its day there.
     * 
     * @param dateToSet - the day to move the end time to
     * @return {Moment | undefined}
     */
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

    /**
     * Gets the width which is available to display tracks.
     * 
     * @return {Moment | undefined}
     */
    getTotalTracksWidth() {
        return this.uiStore.getTotalTracksWidth()
    }

    /**
     * Sets the width which is available to display tracks.
     * Is called whenever the viewport width is changing
     * 
     * @param value 
     */
    setTotalTracksWidth(value: number) {
        this.uiStore.setTotalTracksWidth(value);
    }

    /**
     * @return {number} the width of a single track currently displayed.
     */
    getTrackWidth() {
        return this.uiStore.getTrackWidth()
    }

    /**
     * 
     * @param value - the new width of a single track currently displayed.
     */
    setTrackWidth(value: number) {
        this.uiStore.setTrackWidth(value);
    }

    /**
     * Saves the itemId in the selectHistory stack. 
     * Needed for selecting multiple items using shift.
     * 
     * @param itemId 
     */
    pushToSelectHistory(itemId: string) {
        this.uiStore.getSelectHistory().push(itemId);
    }

    /**
     * Deletes the given ItemID from the selectHistory Stack.
     * Needed for selecting multiple items using shift.
     * @param itemId 
     */
    deleteFromSelectHistory(itemId: string) {
        this.uiStore.setSelectHistory(this.uiStore.getSelectHistory().filter(
            id => id !== itemId
        ));
    }

    /**
     * Deletes all Item IDs from the selectHistoryStack.
     * Needed for selecting multiple items using shift.
     */
    clearSelectHistory() {
        this.uiStore.setSelectHistory([]);
    }


    /**
     * Selects all items between the last selected Item and the given Item and the given Item.
     * 
     * @param itemId 
     */
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


    /**
     * Deletes the item with the given Id.
     * 
     * @param id 
     * @param suppressPushToHistory - suppress adding new state to history stack for Undo/Redo
     */
    deleteItem(id: string, suppressPushToHistory?: boolean) {
        this.agendaStore.deleteItem(id);
        if (!suppressPushToHistory) this.pushToHistory();
    }

    /**
     * Adds the item to the given Track and sorts all items on the track afterwards.
     * 
     * @param item - the items data
     * @param trackId - the track to put the items on
     * @param suppressPushToHistory - suppress adding new state to history stack for Undo/Redo
     */
    addItem(item: IItem, trackId: string, suppressPushToHistory?: boolean) {
        this.agendaStore.addItem(new Item(item), trackId);
        this.agendaStore.getTrack(trackId)!.sortItems();
        if (!suppressPushToHistory) {
            this.pushToHistory();
        }
    }

    /**
     * Partially updates the Item's Properties.
     * 
     * @param id 
     * @param newProps 
     * @param suppressPushToHistory - suppress adding new state to history stack for Undo/Redo
     */
    updateItem(id: string, newProps: { title?: string, speaker?: string, description?: string }, suppressPushToHistory?: boolean) {
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
            if (newProps.description !== undefined && newProps.description !== item.description) {
                item.description = newProps.description;
                changed = true;
            }
            if (!suppressPushToHistory && changed) {
                this.pushToHistory();
            }
        }
    }

    /**
     * Updates the item ItemUIState. 
     * The ItemUIState shows how the user is currently interacting with a specific Item.
     * 
     * @param id 
     * @param newUIState 
     */
    updateItemUIState(id: string, newUIState: ItemUIState | undefined) {
        const item = this.agendaStore.getItem(id);
        if (item) {
            const oldState = item.uiState;
            item.uiState = newUIState;
            if (newUIState === ItemUIState.Selected || oldState === ItemUIState.Selected || oldState === ItemUIState.Editing) {
                this.agendaStore.overWriteCurrentHistoryEntry();
            }
        }
    }


    /**
     * Moves the given Items by the given amount of time. 
     * Does not handle collisions.
     * 
     * @param items 
     * @param milSecToMove 
     */
    moveItemsForced(items: Array<Item>, milSecToMove: number) {
        items.forEach(curItem => {
            curItem.moveByMilSecs(milSecToMove)
        });
    }


    /**
     * Finds the first overlapping time ranges of one item with the given items. 
     * 
     * @param items 
     * @param item 
     * @param exceptItemIds - items with which collisions should be ignored
     */
    private findFirstCollidingIndex(items: Array<Item>, item: Item, exceptItemIds: Array<String>) {
        return items.findIndex((curItem: Item) => {
            return ((curItem.start.isSameOrAfter(item.start) && curItem.start.isBefore(item.end) ||
                curItem.end.isAfter(item.start) && curItem.end.isSameOrBefore(item.end) ||
                item.start.isSameOrAfter(curItem.start) && item.start.isBefore(curItem.end) ||
                item.end.isAfter(curItem.start) && item.end.isSameOrBefore(curItem.end))
            ) && !exceptItemIds.includes(curItem.id)
        })

    }



    /**
     * Get the sum of all durations of the items.
     * 
     * @param items 
     * @returns the total duration
     */
    private getTotalDuration(items: Array<Item>) {
        let totalDuration = 0;
        items.forEach(item => {
            totalDuration = totalDuration + item.getDuration();
        })
        return totalDuration;
    }

    /**
     * Check if the item is directly between two others on the same track. 
     * 
     * @param item
     * @private itemIdsToIgnore
     */
    private itemIsBetweenTwoOthers(item: Item, items: Array<Item>, itemIdsToIgnore: Array<string>): boolean {
        const itemIndex = items.findIndex(curItem => curItem.id === item.id);
        if (itemIndex === undefined || itemIndex === -1) return false;
        if (itemIndex + 1 < items.length &&
            items[itemIndex + 1].start.isSame(item.end) &&
            !itemIdsToIgnore.includes(items[itemIndex + 1].id) &&
            itemIndex - 1 >= 0 &&
            items[itemIndex - 1].end.isSame(item.start) &&
            !itemIdsToIgnore.includes(items[itemIndex - 1].id)
        ) {
            return true;
        }
        return false;

    }



    /**
     * Inserts an Item at the given position. Moves colliding items accordingly.
     * Does not adds the given item on a track or saves it. Only moves the other items accordingly.
     * 
     * @param item 
     * @param items 
     * @param overlappingItemIndex - the first colliding index 
     * @param notToMoveIds 
     */
    private insertItemAfter(item: Item, newStart: Moment, items: Array<Item>, overlappingItemIndex: number, notToMoveIds: Array<string>) {
        //move item after overlapping
        const totalDuration = item.end.diff(item.start)
        item.start = moment(newStart);
        item.end = moment(item.start).add(totalDuration);
        //adjust all items after that accordingly
        if (overlappingItemIndex + 1 < items.length) {
            //find the item which is the next and nearest but not being moved currently
            let nextItem = items[overlappingItemIndex + 1];
            let shouldMove = !notToMoveIds.includes(nextItem.id);
            for (let iOffset = + 2; overlappingItemIndex + iOffset < items.length && notToMoveIds.includes(nextItem.id); iOffset--) {
                nextItem = items[overlappingItemIndex + iOffset];
                shouldMove = true;
                if (overlappingItemIndex + iOffset > items.length - 1) shouldMove = false;
            }
            //if next is colliding move it
            if (shouldMove && item.end.isAfter(nextItem.start)) {
                const moveMilSec = item.end.diff(nextItem.start)
                const otherItemsToMove = items.slice(overlappingItemIndex + 1).filter(curItem => !notToMoveIds.includes(curItem.id))
                this.moveItemsForced(otherItemsToMove, moveMilSec);
            }
        }
    }

    /**
     * Inserts an Item at the given position. Moves colliding items accordingly.
     * Does not adds the given item on a track or saves it. Only moves the other items accordingly.
     * 
     * @param item 
     * @param items 
     * @param overlappingItemIndex - the first colliding index 
     * @param notToMoveIds 
     */
    private insertItemBefore(item: Item, newStart: Moment, items: Array<Item>, overlappingItemIndex: number, notToMoveIds: Array<string>) {
        // move items before overlapping
        const totalDuration = item.end.diff(item.start)
        item.start = moment(newStart);
        item.end = moment(item.start).add(totalDuration);

        // adjust all items after that accordingly
        if (overlappingItemIndex - 1 >= 0) {
            //find the item which is the previous and nearest but not being moved currently
            let previousItem = items[overlappingItemIndex - 1];
            let shouldMove = !notToMoveIds.includes(previousItem.id);
            for (let iOffset = -2; overlappingItemIndex + iOffset >= 0 && notToMoveIds.includes(previousItem.id); iOffset--) {
                previousItem = items[overlappingItemIndex + iOffset];
                shouldMove = true;
                if (overlappingItemIndex + iOffset < 0) shouldMove = false;
            }
            if (shouldMove && item.start.isBefore(previousItem.end)) {
                const moveMilSec = previousItem.end.diff(item.start);
                const otherItemsToMove = items.slice(overlappingItemIndex).filter(curItem => !notToMoveIds.includes(curItem.id));
                item.end.add(moveMilSec);
                item.start.add(moveMilSec);
                this.moveItemsForced(otherItemsToMove, moveMilSec);
            }
        }
    }

    private checkMoveItemsParameters(trackId: string, newStart: Moment) {
        const track = this.agendaStore.getTrack(trackId);
        if (track === undefined) throw new Error("No track with the given Id found.");
        const day = this.agendaStore.getDayForTrack(trackId);
        if (day === undefined) throw new Error("No Day for the Track found.");
        if (!day.startTime.isSame(newStart, 'day')) throw new Error("newStart and the day of the track to move should be on the same day");
    }

    /**
     * Tries to move the given Items to the given start time at the given Track.
     * Avoids collisions with other items. 
     * Therefore the given start time does not have to be the new one.
     * 
     * @param trackId - the track's id to move to
     * @param clickedId - the item's id which the user grabbed of all the itemsIds
     * @param newStart - the new start time where the items should be moved to
     * @param itemIds - the items to move
     */
    moveItems(trackId: string, clickedId: string, newStart: Moment, itemIds: Array<string>) {
        this.checkMoveItemsParameters(trackId, newStart);
        const itemsToMove = this.agendaStore.getItems(undefined, itemIds);
        const totalDuration = this.getTotalDuration(itemsToMove);
        itemsToMove.forEach(item => {
            let track = this.agendaStore.getTrackForItem(item.id);
            let items = track?.items;
            if (!items) return;
            const itemIndex = items.findIndex(curItem => curItem.id === item.id);
            //check if the item is between two other and if so cut it out
            if (this.itemIsBetweenTwoOthers(item, items, itemIds) && !(itemsToMove.length <= 1 && item.start.isSame(newStart))) {
                this.moveItemsForced(items.slice(itemIndex + 1), (item.start.diff(item.end)));
            }
            //check if the track has changed and if so move the item there
            if (item && (track?.id !== trackId)) {
                this.agendaStore.deleteItem(item.id);
                this.agendaStore.addItem(item, trackId);
            }
        })
        let curTrack = this.agendaStore.getTrackForItem(clickedId);
        let items = curTrack?.items;
        if (!items) return;
        const timeLineStart = this.getTimeLineStartTime(items[0].start);
        const movedItemsDummy = new Item({ id: uuid(), start: moment(newStart), end: moment(newStart).add(totalDuration) })
        //collision checking:
        if (movedItemsDummy && curTrack) {
            //find first colliding item
            const overlappingItemIndex = this.findFirstCollidingIndex(items, movedItemsDummy, itemIds);
            if (overlappingItemIndex !== -1) {
                const overlappingItem = items[overlappingItemIndex];
                //check if the colliding item's start or end time is closer
                const movedItemMiddle = movedItemsDummy.getMiddle();
                const overlappingItemMiddle = overlappingItem.getMiddle();
                if (movedItemMiddle.isSameOrAfter(overlappingItemMiddle) || moment(overlappingItem.start).subtract(totalDuration).isBefore(timeLineStart)) {
                    this.insertItemAfter(movedItemsDummy, overlappingItem.end, items, overlappingItemIndex, itemIds);
                } else {
                    this.insertItemBefore(movedItemsDummy, moment(overlappingItem.start).subtract(totalDuration), items, overlappingItemIndex, itemIds);
                }
            }
            //insert the actual items at the dummy's position
            let startTimeToInsert = moment(movedItemsDummy.start);
            itemsToMove.forEach(item => {
                item.moveByMoment(startTimeToInsert);
                startTimeToInsert.add(item.getDuration());
            });
        }
        curTrack?.sortItems();
    }

    /**
     * Unselects all items.
     */
    unselectAll() {
        this.agendaStore.getItems({ uiState: ItemUIState.Selected }).forEach(item => {
            item.uiState = undefined;
        })
        this.agendaStore.overWriteCurrentHistoryEntry();
        this.updateUIState(UIState.Normal);
        this.clearSelectHistory();
    }


    /**
     * 
     * @param keepItemUIState - if the itemUIState (e.g. which items are selected) should be used from the history
     * @param suppressDataChangeHandling - if the change should not be handled (e.g. not save to a database), handle data change will not be called
     */
    undo(keepItemUIState?: boolean, suppressDataChangeHandling?: boolean) {
        this.agendaStore.undo();
        if (!keepItemUIState) {
            //case this method is not called during moving of items
            this.agendaStore.getItems().forEach(item => {
                item.uiState = undefined;
            });
            if (this.canPaginateRight()) this.applyTotalTrackWidthToTrackVisibility();
        }
        if (this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
    }

    /**
     * @return if there is a state to undo to
     */
    canUndo() {
        return this.agendaStore.canUndo()
    }

    /**
     * 
     * @param keepItemUIState - if the itemUIState (e.g. which items are selected) should be used from the history
     * @param suppressDataChangeHandling - if the change should not be handled (e.g. not save to a database), handle data change will not be called
     */
    redo(keepItemUIState?: boolean, suppressDataChangeHandling?: boolean) {
        this.agendaStore.redo();
        if (!keepItemUIState) {
            //case this method is not called during moving of items
            this.agendaStore.getItems().forEach(item => {
                item.uiState = undefined;
            })
            if (this.canPaginateRight()) this.applyTotalTrackWidthToTrackVisibility();
        }
        if (this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
    }

    /**
     * @return if there is a state to redo to
     */
    canRedo() {
        return this.agendaStore.canRedo()
    }

    /**
     * adds the current state to the undo/redo history stack
     * @param suppressDataChangeHandling - if the change should not be handled (e.g. not save to a database), handle data change will not be called
     */
    pushToHistory(suppressDataChangeHandling?: boolean) {
        this.agendaStore.pushToHistory();
        if (this.handleDataChange && !suppressDataChangeHandling) this.handleDataChange()
    }

    /**
     * overwrites the current entry with out adding a new one to the undo/redo history stack.
     */
    overWriteCurrentHistoryEntry() {
        this.agendaStore.overWriteCurrentHistoryEntry();
    }

    /**
     * Tries to change the item's start time. 
     * If the newStartTime is before the end time of the previous item no changes are applied.
     * 
     * @param itemId 
     * @param newStartTime 
     */
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
    }

    /**
     * Tries to change the item's end time. 
     * If the new end time is after the start time of the next item all next items on the track
     * are moved to avoid collisions.
     * 
     * @param itemId 
     * @param newStartTime 
     */
    adjustItemEndTime(itemId: string, newEndTime: Moment) {
        // const item = this.agendaStore.getItem(itemId);
        const items = this.agendaStore.getItemAndFollowingItems(itemId);
        if (items) {
            const item = items[0];
            if (newEndTime.isSameOrBefore(item.start)) return;
            const nextItem = items[1];
            if (nextItem && (nextItem.start.isBefore(newEndTime) || nextItem.start.isSame(item.end))) {
                this.moveItemsForced(items.slice(1), newEndTime.diff(nextItem.start))
            }
            if (!item.end.isSame(newEndTime)) {
                item.end = newEndTime;
            }
        }
    }

    /**
     * Checks if there are days left to paginate to.
     */
    canPaginateRight() {
        const allDays = this.agendaStore.getDays();
        const lastUiHidden = allDays[allDays.length - 1].uiHidden;
        if (lastUiHidden) return true;
        else return false;
    }

    /**
     * Paginates the days to the right.
     */
    paginateRight() {
        const displayableTracks = this.getNumberOfDisplayableTracks();
        const allDays = this.agendaStore.getDays();
        const lastVisibleIndex = findLastIndex(allDays, day => !day.uiHidden);
        if (allDays.length - 1 > lastVisibleIndex || lastVisibleIndex === -1) {
            const firstVisibleIndex = allDays.findIndex(day => !day.uiHidden);
            for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
                allDays[i].uiHidden = true;
            }
            let revealedDays = 0;
            for (let i = lastVisibleIndex + 1; i < allDays.length && revealedDays < displayableTracks; i++) {
                allDays[i].uiHidden = false;
                revealedDays++;
            }
        }
        this.agendaStore.overWriteCurrentHistoryEntry();
    }

    /**
     * Checks if there are days left to paginate to.
     */
    canPaginateLeft() {
        const allDays = this.agendaStore.getDays();
        const firstUiHidden = allDays[0].uiHidden;
        if (firstUiHidden) return true;
        else return false;
    }

    /**
     * Paginates the days to the left.
     */
    paginateLeft() {
        const displayableTracks = this.getNumberOfDisplayableTracks();
        const allDays = this.agendaStore.getDays();
        const firstVisibleIndex = allDays.findIndex(day => !day.uiHidden);
        if (firstVisibleIndex > 0) {
            const lastVisibleIndex = findLastIndex(allDays, day => !day.uiHidden);
            for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
                allDays[i].uiHidden = true;
            }
            let revealedDays = 0;
            let newFirstVisibleIndex = firstVisibleIndex - displayableTracks;
            if (newFirstVisibleIndex < 0) newFirstVisibleIndex = 0;
            for (let i = newFirstVisibleIndex; i < allDays.length && revealedDays < displayableTracks; i++) {
                allDays[i].uiHidden = false;
                revealedDays++;
            }
        }
        this.agendaStore.overWriteCurrentHistoryEntry();
    }

    getDaysToReveal(numberToReveal: number) {
        const allDays = this.agendaStore.getDays();
        const daysToReveal: Array<Day> = [];

        const lastVisibleIndex = findLastIndex(allDays, day => !day.uiHidden);
        if (lastVisibleIndex !== -1) {
            for (let i = lastVisibleIndex + 1; i < allDays.length; i++) {
                daysToReveal.push(allDays[i]);
                numberToReveal--;
                if (numberToReveal === 0) return daysToReveal;
            }
        } else {
            return daysToReveal;
        }

        const firstVisibleIndex = allDays.findIndex(day => !day.uiHidden);
        for (let i = firstVisibleIndex - 1; i >= 0; i--) {
            daysToReveal.push(allDays[i]);
            numberToReveal--;
            if (numberToReveal === 0) return daysToReveal;
        }
        return daysToReveal;
    }

    getNumberOfDisplayableTracks() {
        let displayableTracks = Math.floor(this.getTotalTracksWidth() / 200);
        if (displayableTracks === 0) displayableTracks = 1;
        return displayableTracks;
    }

    applyTotalTrackWidthToTrackVisibility() {
        const days: Array<Day> = this.agendaStore.getDays({ uiHidden: false });
        const displayableTracks = this.getNumberOfDisplayableTracks();
        if (days.length > displayableTracks) {
            const numberOfDaysToHide = days.length - displayableTracks;
            for (let i = 0; i < numberOfDaysToHide; i++) {
                this.setDayUiHidden(days[days.length - 1 - i].id, true);
            }
        } else if (days.length < displayableTracks) {
            const daysToReveal = this.getDaysToReveal(displayableTracks - days.length);
            if (daysToReveal.length > 0) daysToReveal.forEach(day => this.setDayUiHidden(day.id, false));
        }
        this.overWriteCurrentHistoryEntry();
    }

    /**
     * Moves all days and their track's items for the given number of days.
     * 
     * @param numberOfDays - the number of days to move, may be negative.
     */
    addDaysToAllDates(numberOfDays: number) {
        for (const day of this.agendaStore.agenda.days) {
            day.startTime = moment(day.startTime).add(numberOfDays, 'days');
            day.endTime = moment(day.endTime).add(numberOfDays);
            for (const track of day.tracks) {
                for (const item of track.items) {
                    item.start = moment(item.start).add(numberOfDays, 'days');
                    item.end = moment(item.end).add(numberOfDays, 'days');
                }
            }
        }
    }
}

