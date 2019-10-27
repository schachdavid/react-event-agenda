import { Moment } from "moment";
import { Item } from "../models/ItemModel";

export default interface AgendaViewModelI {
    
     /**
     * Get all agenda items.
     */
    getDays(): any;


    addItem(item: any): void;

    
    /**
     * Tries to adjust the item's start time. 
     *
     */
    adjustItemStartTime(itemId: string, newStart: Moment): void;

    
    /**
     * Tries to adjust the item's end time. 
     *
     */
    adjustItemEndTime(itemId: string, newStart: Moment): void;

    /**
     * Deletes the agenda item with the given id.
     */
    deleteItem(id: string): void;


     /**
     * Tries to move the item to the given start time on the given track.
     */
    moveItem(trackId: string, id: string, newStart: Moment):void;

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

