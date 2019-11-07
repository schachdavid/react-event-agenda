import { Moment } from 'moment';
import { observable, computed } from 'mobx';
import { Track, ITrack } from './TrackModel';

export interface IDay {
    date: Moment,
    id: string,
    tracks: Array<ITrack>
}


export class Day {
    @observable private _date: Moment;
    @observable private _id: string;
    @observable private _tracks: Array<Track>;


    constructor(obj: IDay) {
        this._date = obj.date;
        this._id = obj.id;
        this._tracks = obj.tracks.map((track) => Track.fromJSON(track));
    }

    /**
     * Getter date
     * @return {Moment}
     */
    @computed public get date(): Moment {
        return this._date;
    }

    /**
     * Setter date
     * @param {Moment} value
     */
    public set date(value: Moment) {
        this._date = value;
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

    /**
     * Getter tracks
     * @return {Array<Track>}
     */
     @computed public get tracks(): Array<Track> {
        return this._tracks;
    }

    /**
     * Setter tracks
     * @param {Array<Track>} value
     */
    public set tracks(value: Array<Track>) {
        this._tracks = value;
    }

    toJSON(): IDay {
        return {
            id: this._id,
            date: this._date,
            tracks: this._tracks.map((track) => track.toJSON())
        }
    }

    static fromJSON(obj: IDay) {
        return new this(obj);
    }

}