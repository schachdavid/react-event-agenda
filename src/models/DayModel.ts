import { Moment } from 'moment';
import { observable } from 'mobx';
import { Track, ITrack } from './TrackModel';

export interface IDay {
    startTime: Moment,
    endTime: Moment,
    id: string,
    tracks: Array<ITrack>
}


export class Day {
    @observable private _startTime: Moment;
    @observable private _endTime: Moment;
    @observable private _id: string;
    @observable private _tracks: Array<Track>;


    constructor(obj: IDay) {
        this._startTime = obj.startTime;
        this._endTime = obj.endTime;
        this._id = obj.id;
        this._tracks = obj.tracks.map((track) => Track.fromJSON(track));
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
     * Getter _endTime
     * @return {Moment}
     */
    public get endTime(): Moment {
        return this._endTime;
    }

    /**
     * Setter _endTime
     * @param {Moment} value
     */
    public set endTime(value: Moment) {
        this._endTime = value;
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
     * Getter tracks
     * @return {Array<Track>}
     */
      public get tracks(): Array<Track> {
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
            startTime: this._startTime,
            endTime: this._endTime,
            tracks: this._tracks.map((track) => track.toJSON())
        }
    }

    static fromJSON(obj: IDay) {
        return new this(obj);
    }

}