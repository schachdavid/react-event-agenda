import { Moment } from "moment";

export default interface AgendaViewModelI {
    
     /**
     * Get all agenda items.
     */
    getDays(): any;

    /**
     * Undo the last thing that happened on agenda item data level.
     */
    addItem(item: any): void;

    /**
     * Deletes the agenda item with the given id.
     */
    deleteItem(itemId: string): void;


     /**
     * Tries to move the item to the given start time on the given track.
     */
    moveItem(trackId: string, itemId: string, newStart: Moment):void;

    /**
     * Undo the last thing that happened on agenda item data level.
     */
    undo():void;

    /**
     * Redo the last thing that happened on agenda item data level.
     */
    redo():void;

     /**
     * Gets the agenda's start time.
     */
    getStartTime(): Moment;

     /**
     * Gets the agenda's end time.
     */
    getEndTime(): Moment;

    /**
     * Push current agenda data to the history stack for the undo/redo functionality.
     */
    pushToHistory(): void;
}

