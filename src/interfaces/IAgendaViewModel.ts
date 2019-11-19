import { Moment } from "moment";
import { IItem } from "../models/ItemModel";

export interface IAgendaViewModel {
    
     /**
     * Get all agenda items.
     */
    getDays(): any;


    addItem(item: IItem, trackId: string, pushToHistory?: boolean): void;

    
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
    deleteItem(id: string, pushToHistory?: boolean): void;


     /**
     * Tries to move the item to the given start time on the given track.
     */
    moveItem(trackId: string, id: string, newStart: Moment):void;

    /**
     * Undo the last thing that happened on agenda item data level.
     */
    undo(keepItemUIState?: boolean):void;

    /**
     * Redo the last thing that happened on agenda item data level.
     */
    redo(keepItemUIState?: boolean):void;


    /**
     * Push current agenda data to the history stack for the undo/redo functionality.
     */
    pushToHistory(): void;
}

