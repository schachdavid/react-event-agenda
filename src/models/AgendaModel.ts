import { observable } from 'mobx';
import { Day, IDay } from './DayModel';
import { Moment } from 'moment';



export interface IAgenda {
    id: string,
    startTime: Moment,
    endTime: Moment,
    days: Array<IDay>
}

export class Agenda {
    @observable private _id: string;
    @observable private _startTime: Moment;
    @observable private _endTime: Moment;
    @observable private _days: Array<Day>;


    constructor(obj: IAgenda) {
        this._id = obj.id;
        this._startTime = obj.startTime;
        this._endTime = obj.endTime;
        this._days = obj.days.map((day) => Day.fromJSON(day));
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
     * Getter startTime
     * @return {Moment}
     */
     public get startTime(): Moment {
        return this._startTime;
    }

    /**
     * Setter startTime
     * @param {Moment} value
     */
    public set startTime(value: Moment) {
        this._startTime = value;
    }

    /**
     * Getter endTime
     * @return {Moment}
     */
     public get endTime(): Moment {
        return this._endTime;
    }

    /**
     * Setter endTime
     * @param {Moment} value
     */
    public set endTime(value: Moment) {
        this._endTime = value;
    }

    /**
     * Getter days
     * @return {Array<Day>}
     */
     public get days(): Array<Day> {
        return this._days;
    }

    /**
     * Setter days
     * @param {Array<Day>} value
     */
    public set days(value: Array<Day>) {
        this._days = value;
    }


    toJSON(): IAgenda {
        return {
            id: this._id,
            startTime: this._startTime,
            endTime: this._endTime,
            days: this._days.map((day) => day.toJSON())
        }
    }

    static fromJSON(obj: IAgenda) {
        return new this(obj);
    }

}