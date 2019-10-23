import {Moment} from 'moment';



export interface ItemData {
    title?: string,
    speaker?: string,
    start: Moment,
    end: Moment,
    itemId: string,
}

export interface ItemUi {
    ui?: {
        editing?: boolean,
        hovering?: boolean,
        dragging?: boolean,
    }
}

export interface Item extends ItemData, ItemUi {

}

export interface Track {
    trackName: string,
    items: Array<Item>,
    trackId: string
}


export interface Day {
    date: Moment,
    dayId: string,
    tracks: Array<Track>

}


export interface Agenda {
    startTime: Moment,
    endTime: Moment,
    days: Array<Day>
}

