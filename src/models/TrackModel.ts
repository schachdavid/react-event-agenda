import { observable, IObservableArray } from 'mobx';
import { Item, IItem } from './ItemModel';


export interface ITrack {
    name: string,
    items: Array<IItem>,
    id: string
}

export class Track {
    @observable private _name: string;
    @observable private _items: IObservableArray<Item>;
    @observable private _id: string;


    constructor(obj: ITrack) {
        this._name = obj.name;
        this._items = observable(obj.items.map((item) => Item.fromJSON(item)));
        this._id = obj.id;
    }

    /**
     * Sorts all agenda items in this track by start time
     */
    public sortItems()  {
        this._items.replace( this._items.slice().sort((a,b) => {
            if ( a.start.isBefore(b.start)){
                return -1;
              }
              if ( a.start.isAfter(b.start)){
                return 1;
              }
              return 0;
        }));
    }


    /**
     * Getter name
     * @return {string}
     */
     public get name(): string {
        return this._name;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Getter items
     * @return {IObservableArray<Item> | Array<Item>}
     */
     public get items(): IObservableArray<Item> {
        return this._items;
    }

    /**
     * Setter items
     * @param {Array<Item>} value
     */
    public set items(value: IObservableArray<Item> ) {
        this._items.replace(value);
    }

    /**
     * Getter id
     * @return {string}
     */
     public get id(): string {
        return this._id;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            items: this._items.map((item) => item.toJSON()),
        }
    }

    static fromJSON(obj: ITrack) {
        return new this(obj);
    }


}