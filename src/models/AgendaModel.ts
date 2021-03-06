import { observable } from 'mobx';
import { Day, IDay, IDayJSON } from './DayModel';

export interface IAgenda {
    id: string,
    days: Array<IDay>
}

export interface IAgendaJSON {
    id: string,
    days: Array<IDayJSON>
}


export class Agenda {
    @observable private _id: string;
    @observable private _days: Array<Day>;


    constructor(obj: IAgendaJSON) {
        this._id = obj.id;
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


    toJSON(): IAgendaJSON {
        return {
            id: this._id,
            days: this._days.map((day) => day.toJSON())
        }
    }

    static fromJSON(obj: IAgendaJSON) {
        return new this(obj);
    }

}