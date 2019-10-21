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
     * Undo the last thing that happened on agenda item data level.
     */
    undo():void;

    /**
     * Undo the last thing that happened on agenda item data level.
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
}

