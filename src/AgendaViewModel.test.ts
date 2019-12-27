import { AgendaViewModel } from './AgendaViewModel'
import { getTestData } from './util/testData'
import moment from 'moment';
import { UIState } from './models/UIStore';
import { IDayJSON } from './models/DayModel';
import { removeUndefinedKeys } from './util/util';




describe("constructor", () => {
    it('sets the data', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        expect(agendaViewModel.getData()).toMatchObject(initialData);
    });
});

describe("setData & getData", () => {
    it('sets the data', () => {
        const agendaViewModel = new AgendaViewModel({
            "id": "1",
            "days": []
        });
        const testData = getTestData();
        agendaViewModel.setData(testData);
        expect(agendaViewModel.getData()).toMatchObject(testData);
    });
});

describe("updateUIState", () => {
    it('sets new UI State', () => {
        const agendaViewModel = new AgendaViewModel({
            "id": "1",
            "days": []
        });
        agendaViewModel.updateUIState(UIState.Creating);
        expect(agendaViewModel.getUIState()).toBe(UIState.Creating);
    });
});


describe("getAgendaStore", () => {
    it('agenda store is defined', () => {
        const agendaViewModel = new AgendaViewModel({
            "id": "1",
            "days": []
        });
        expect(agendaViewModel.getAgendaStore()).toBeDefined();
    });
});

describe("getDays", () => {
    it('returns the days', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        expect(JSON.stringify(agendaViewModel.getDays())).toEqual(JSON.stringify(initialData.days)); 
    });

    it('filters the days', () => {
        const initialData = getTestData();
        initialData.days[0].uiHidden = false;
        initialData.days[1].uiHidden = true;
        const agendaViewModel = new AgendaViewModel(initialData);
        expect(JSON.stringify(agendaViewModel.getDays({uiHidden: true})[0])).toEqual(JSON.stringify(initialData.days[1])); 
    });
});


describe("deleteDay", () => {
    it('deletes the day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.deleteDay(initialData.days[0].id);
        const modInitialDays = initialData.days;
        expect(removeUndefinedKeys(agendaViewModel.getDays()[0])).toEqual(removeUndefinedKeys(modInitialDays[1])); 
    });
});


describe("mremoveUndefinedKeys(oveItem", () => {
    it('applies changes to freely moved item', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const firstTrack = initialData.days[0].tracks[0];
        const items = firstTrack.items;
        const lastItem = items[items.length - 1];
        agendaViewModel.moveItems(firstTrack.id, lastItem.id, moment(lastItem.start).add(2, 'hours'), [lastItem.id]);
        lastItem.start = moment(lastItem.start).add(2, 'hours').toJSON();
        lastItem.end = moment(lastItem.end).add(2, 'hours').toJSON();
        expect(agendaViewModel.getData()).toMatchObject(initialData);
    });

    it('applies changes to freely moved item while changing track', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const firstTrack = initialData.days[0].tracks[0];
        const itemsFirstTrack = firstTrack.items;
        const lastItem = itemsFirstTrack[itemsFirstTrack.length - 1];
        const secondTrack = initialData.days[1].tracks[0];
        agendaViewModel.moveItems(secondTrack.id, lastItem.id, moment(lastItem.start).add(1, 'day').add(4, 'hours'), [lastItem.id]);
        lastItem.start = moment(lastItem.start).add(1, 'day').add(4, 'hours').toJSON();
        lastItem.end = moment(lastItem.end).add(1, 'day').add(4, 'hours').toJSON();
        itemsFirstTrack.pop();
        secondTrack.items.push(lastItem);
        expect(agendaViewModel.getData()).toMatchObject(initialData);
    });

    it('handles collisions', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const firstTrack = initialData.days[0].tracks[0];
        const items = firstTrack.items;
        let lastItem = items[items.length - 1];
        agendaViewModel.moveItems(firstTrack.id, lastItem.id, moment(lastItem.start).subtract(1.5, 'hours'), [lastItem.id]);
        lastItem.start = moment(lastItem.start).subtract(1, 'hours').toJSON();
        lastItem.end = moment(lastItem.end).subtract(1, 'hours').toJSON();
        //swap
        items[items.length - 1] = items[items.length - 2];
        items[items.length - 2] = lastItem;
        // apply changes to previous/new last
        lastItem = items[items.length - 1];
        lastItem.start = moment(lastItem.start).add(2, 'hours').toJSON();
        lastItem.end = moment(lastItem.end).add(2, 'hours').toJSON();
        expect(agendaViewModel.getData()).toMatchObject(initialData);
    });
});