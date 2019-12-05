import { observable, action, toJS } from 'mobx';
// import moment from 'moment';
import { Item, ItemUIState } from './ItemModel';
import { Track } from './TrackModel';
// import { Day } from './DayModel';
import { Agenda, IAgenda, IAgendaJSON } from './AgendaModel';

class AgendaStore {
    @observable agenda: Agenda;
    // TODO: move to ui store
    @observable intervalPxHeight: number = 50;
    @observable intervalInMin: number = 15;
    @observable segmentFactor: number = 4;

    agendaHistory: Array<IAgendaJSON> = [];
    pointer: number = -1;

    constructor(data: IAgendaJSON) {
        this.agenda = Agenda.fromJSON(data);
        this.pushToHistory();
    }

    @action addItem(item: Item, trackId: string) {
        const track = this.getTrack(trackId);
        const day = this.getDayForTrack(trackId);

        if (day && track) {
            const dayStartTime = day.startTime;
            item.start.set({ 'date': dayStartTime.get('date'), 'month': dayStartTime.get('month'), 'year': dayStartTime.get('year') })
            item.end.set({ 'date': dayStartTime.get('date'), 'month': dayStartTime.get('month'), 'year': dayStartTime.get('year') })
            const items = track.items;
            items.push(item);
        }
    }

    @action setAgenda(agenda: Agenda) {
        this.agenda = agenda;
    }

    @action setTitle(itemId: string, newTitle: string) {
        const item = this.getItem(itemId);
        if (item) {
            item.title = newTitle
        }
    }

    getDays(filter?: { uiHidden?: boolean },) {
        let days = this.agenda.days;
        if (filter) {
            days = days.filter((day) => {
                const uiHidden = day.uiHidden !== undefined ? day.uiHidden : false;
                return uiHidden === filter.uiHidden;
            });
        }
        return days;
    }


    getDay(id: string) {
        return this.agenda.days.find((day) => day.id === id);
    }

    getAgenda(): IAgenda {
        return this.agenda;
    }

    getDayForTrack(trackId: string) {
        let days = this.agenda.days;
        for (let indexDays: number = 0; indexDays < days.length; indexDays++) {
            let tracks = days[indexDays].tracks;
            let foundTrack: Track | undefined = tracks.find((track: Track) => track.id === trackId);
            if (foundTrack) {
                return days[indexDays];
            }
        }
        return undefined;
    }

    getTrack(id: string) {
        let days = this.agenda.days;
        for (let indexDays: number = 0; indexDays < days.length; indexDays++) {
            let tracks = days[indexDays].tracks;
            let foundTrack: Track | undefined = tracks.find((track: Track) => track.id === id);
            if (foundTrack) {
                return foundTrack;
            }
        }
        return undefined;
    }

    getTrackForItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const item: Item | undefined = track.items.find((item) => item.id === id);
                if (item) {
                    return track;
                }
            }
        }
        return;
    }

    getDayForItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const item: Item | undefined = track.items.find((item) => item.id === id);
                if (item) {
                    return day;
                }
            }
        }
        return;
    }

    getItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const item: Item | undefined = track.items.find((item) => item.id === id);
                if (item) {
                    return item;
                }
            }
        }
        return undefined;
    }

    getItems(filter?: { uiState?: ItemUIState }, itemIds?: Array<string>) {
        let items: Array<Item> = [];
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                let itemsOnTrack = track.items.slice();
                if (filter) {
                    itemsOnTrack = itemsOnTrack.filter((item) => item.uiState === filter.uiState);
                }
                if (itemIds) {
                    itemsOnTrack = itemsOnTrack.filter((item) => itemIds.includes(item.id));
                }
                items = items.concat(itemsOnTrack);
            }
        }
        return items;
    }

    /**
     *  Gets the item with the given Id and all following items on the same track 
     *
     * @param {string} id
     * @returns
     * @memberof AgendaStore
     */
    getItemAndFollowingItems(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const index: number = track.items.findIndex((item) => item.id === id);
                if (index != -1) {
                    return track.items.slice(index);
                }
            }
        }
        return undefined;
    }

    @action deleteItem(id: string) {
        for (const day of this.agenda.days) {
            for (const track of day.tracks) {
                const itemsTmp = track.items.filter((item) => item.id !== id)
                if (itemsTmp.length !== track.items.length) {
                    track.items.replace(itemsTmp);
                    return;
                }
            }
        }
    }

    getIntervalPxHeight() {
        return this.intervalPxHeight;
    }

    getIntervalInMin() {
        return this.intervalInMin;
    }

    getSegmentFactor() {
        return this.segmentFactor;
    }

    pushToHistory() {
        this.pointer++;
        this.agendaHistory.splice(this.pointer, this.agendaHistory.length);
        console.log("pushed: ",this.agenda.days.filter(day => !day.uiHidden));
        this.agendaHistory.push(toJS(this.agenda).toJSON());
    }

    overWriteCurrentHistoryEntry() {
        this.agendaHistory[this.pointer] = toJS(this.agenda).toJSON();
    }

    @action undo() {
        if (this.pointer > 0) {
            this.pointer--;
            console.log("-----------------------------");
            console.log("before: ",this.agenda.days.filter(day => !day.uiHidden));

            this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
            console.log("after: ",this.agenda.days.filter(day => !day.uiHidden));
        }
    }

    @action redo() {
        if (this.pointer < this.agendaHistory.length - 1) {
            this.pointer++;
            this.setAgenda(Agenda.fromJSON(this.agendaHistory[this.pointer]));
        }
    }

}

export default AgendaStore;
export { Item, IItem } from './ItemModel';
export { Track, ITrack } from './TrackModel';
export { Day, IDay } from './DayModel';
export { Agenda, IAgenda } from './AgendaModel';