import moment, { Moment } from 'moment';
import { observable } from 'mobx';


export interface IItem {
    readonly id: string,
    readonly title?: string,
    readonly speaker?: string,
    readonly start: Moment,
    readonly end: Moment
}

export class Item {
    @observable private _id: string;
    @observable private _title: string;
    @observable private _speaker: string;
    @observable private _start: Moment;
    @observable private _end: Moment;


    constructor(obj: IItem) {
        this._id = obj.id!;
        this._title = obj.title!;
        this._speaker = obj.speaker!;
        this._start = moment(obj.start);
        this._end = moment(obj.end);
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

    /**
     * Getter title
     * @return {string}
     */
     public get title(): string {
        return this._title;
    }

    /**
     * Setter title
     * @param {string} value
     */
    public set title(value: string) {
        this._title = value;
    }

    /**
     * Getter speaker
     * @return {string}
     */
      public get speaker(): string {
        return this._speaker;
    }

    /**
     * Setter speaker
     * @param {string} value
     */
    public set speaker(value: string) {
        this._speaker = value;
    }

    /**
     * Getter start
     * @return {Moment}
     */
      public get start(): Moment {
        return this._start;
    }

    /**
     * Setter start
     * @param {Moment} value
     */
    public set start(value: Moment) {
        this._start = value;
    }

    /**
     * Getter end
     * @return {Moment}
     */
     public get end(): Moment {
        return this._end;
    }

    /**
     * Setter end
     * @param {Moment} value
     */
    public set end(value: Moment) {
        this._end = value;
    }

    toJSON(): IItem {
        return {
            id: this._id,
            title: this._title,
            speaker: this._speaker,
            start: this._start,
            end: this._end,
        }
    }

    static fromJSON(obj: IItem) {
        return new this(obj);
    }
}