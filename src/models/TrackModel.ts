import { observable, computed } from 'mobx';
import { Item, IItem } from './ItemModel';


export interface ITrack {
    name: string,
    items: Array<IItem>,
    id: string
}

export class Track {
    @observable private _name: string;
    @observable private _items: Array<Item>;
    @observable private _id: string;


    constructor(obj: ITrack) {
        this._name = obj.name;
        this._items = obj.items.map((item) => Item.fromJSON(item));
        this._id = obj.id;
    }


    /**
     * Getter name
     * @return {string}
     */
    @computed public get name(): string {
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
     * @return {Array<Item>}
     */
    @computed public get items(): Array<Item> {
        return this._items;
    }

    /**
     * Setter items
     * @param {Array<Item>} value
     */
    public set items(value: Array<Item>) {
        this._items = value;
    }

    /**
     * Getter id
     * @return {string}
     */
    @computed public get id(): string {
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