import { Dao } from '../../interfaces/modelnterfaces';
import { Moment } from 'moment';

export class Item implements Dao {
    private _id: string;
    private _start: Moment;
    private _end: Moment;

    get id(): string {
        return this._id;
    }

    set id(newId: string) {
        this._id = newId;
    } 

    fromJSON() {

    }

    toJSON() {
        return ""
    }
}