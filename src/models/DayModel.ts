import moment, { Moment } from 'moment';
import { observable } from 'mobx';
import { Track, ITrack, ITrackJSON } from './TrackModel';

export interface IDay {
    readonly startTime: Moment,
    readonly endTime: Moment,
    readonly id: string,
    readonly tracks: Array<ITrack>,
    readonly uiHidden: boolean
}

export interface IDayJSON {
    startTime: string,
    endTime: string,
    id: string,
    tracks: Array<ITrackJSON>,
    uiHidden?: boolean
}


export class Day {
    @observable private _startTime: Moment;
    @observable private _endTime: Moment;
    @observable private _id: string;
    @observable private _tracks: Array<Track>;
    @observable private _uiHidden: boolean;



    constructor(obj: IDayJSON) {
        this._startTime = moment(obj.startTime);
        this._endTime = moment(obj.endTime);
        this._id = obj.id;
        this._tracks = obj.tracks.map((track) => Track.fromJSON(track));
        this._uiHidden = obj.uiHidden ? obj.uiHidden : false;
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

    /**
     * Getter uiHidden
     * @return {boolean}
     */
    public get uiHidden(): boolean {
        return this._uiHidden;
    }

    /**
     * Setter uiHidden
     * @param {boolean} value
     */
    public set uiHidden(value: boolean) {
        this._uiHidden = value;
    }

    toJSON(): IDayJSON {
        return {
            id: this._id,
            startTime: this._startTime.toJSON(),
            endTime: this._endTime.toJSON(),
            tracks: this._tracks.map((track) => track.toJSON()),
            uiHidden: this.uiHidden
        }
    }

    static fromJSON(obj: IDayJSON) {
        return new this(obj);
    }

}