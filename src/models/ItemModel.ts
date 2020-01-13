import moment, { Moment } from 'moment';
import { observable } from 'mobx';


export enum ItemUIState {
    Editing,
    Selected
}

export interface IItem {
    readonly id: string,
    readonly title?: string,
    readonly speaker?: string,
    readonly description?: string,
    readonly start: Moment,
    readonly end: Moment,
    readonly uiState?: ItemUIState
}

export interface IItemJSON {
    id: string,
    title?: string,
    speaker?: string,
    description?: string,
    start: string,
    end: string,
    uiState?: ItemUIState
}


export class Item {
    @observable private _id: string;
    @observable private _title: string;
    @observable private _speaker: string;
    @observable private _description: string;
    @observable private _start: Moment;
    @observable private _end: Moment;
    @observable private _uiState?: ItemUIState = undefined;

    /**
     * Getter uiState
     * @return {ItemUIState | undefined}
     */
	public get uiState(): ItemUIState | undefined  {
		return this._uiState;
	}

    /**
     * Setter uiState
     * @param {ItemUIState | undefined} value
     */
	public set uiState(value: ItemUIState | undefined) {
		this._uiState = value;
	}


    constructor(obj: IItem | IItemJSON) {
        this._id = obj.id!;
        this._title = obj.title!;
        this._speaker = obj.speaker!;
        this._start = moment(obj.start);
        this._end = moment(obj.end);
        this._uiState = obj.uiState;
        this._description = obj.description!;
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
     * Getter description
     * @return {string}
     */
	public get description(): string {
		return this._description;
	}

    /**
     * Setter description
     * @param {string} value
     */
	public set description(value: string) {
		this._description = value;
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

    /**
     * Gets the middle between start and end. 
     * 
     * @param start 
     * @param end 
     */
    public getMiddle() {
        return moment(this._start).add(this._end.diff(this._start) / 2);
    }

    /**
     * Gets the item's duration in milliseconds.
     */
    public getDuration() {
        return this._end.diff(this._start);
    }

    /**
     * Moves the item's start and end time by the given amount of time.
     * Is not aware about other items.
     * 
     * @param milSecToMove 
     */
    public moveByMilSecs(milSecToMove: number) {
        const newStart = moment(this._start).add(milSecToMove);
        const newEnd = moment(this._end).add(milSecToMove);
        this._start = newStart;
        this._end = newEnd;
    }

    /**
     * Moves the item's start to the given start time.
     * Move the item's end time accordingly. 
     * Is not aware about other items.
     * 
     * @param newStart 
     */
    public moveByMoment(newStart: Moment) {
        const duration = this.getDuration();
        this._start = moment(newStart);
        this._end = moment(newStart).add(duration);
    }



    toJSON(): IItemJSON {
        return {
            id: this._id,
            title: this._title,
            speaker: this._speaker,
            description: this._description,
            start: this._start.toJSON(),
            end: this._end.toJSON(),
            uiState: this._uiState
        }
    }

    static fromJSON(obj: IItemJSON) {
        return new this(obj);
    }
}