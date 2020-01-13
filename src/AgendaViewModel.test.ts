import { AgendaViewModel } from './AgendaViewModel'
import { getTestData } from './util/testData'
import moment from 'moment';
import { UIState } from './models/UIStore';
import { IDayJSON } from './models/DayModel';
import uuid from 'uuid';
import { ItemUIState, IItem } from './models/ItemModel';




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
        expect(JSON.stringify(agendaViewModel.getDays({ uiHidden: true })[0])).toEqual(JSON.stringify(initialData.days[1]));
    });
});


describe("deleteDay", () => {
    it('deletes the day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        let day = agendaViewModel.getDays()?.find(day => day.id === initialData.days[0].id);
        expect(day).toBeDefined();
        agendaViewModel.deleteDay(initialData.days[0].id);
        day = agendaViewModel.getDays()?.find(day => day.id === initialData.days[0].id);
        expect(day).toBeUndefined();
    });
});

describe("addDay", () => {
    it('adds a day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const newDayId = uuid();
        const newDay: IDayJSON = {
            id: newDayId,
            startTime: initialData.days[2].startTime,
            endTime: initialData.days[2].endTime,
            tracks: [
                { id: uuid(), name: '', items: [] }
            ]
        }
        let day = agendaViewModel.getDays()?.find(day => day.id === newDayId);
        expect(day).toBeUndefined();
        agendaViewModel.addDay(newDay);
        day = agendaViewModel.getDays()?.find(day => day.id === newDayId);
        expect(day).toBeDefined();
    });
});

describe("setDayUIHidden", () => {
    it('hides the day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.setDayUiHidden(initialData.days[0].id, true);
        const days = agendaViewModel.getDays();
        expect(days[0].uiHidden).toBeTruthy();
    });
});



describe("getTimelineStartTime", () => {
    it('adds a day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const timeLineStartTime = agendaViewModel.getTimeLineStartTime();
        expect(timeLineStartTime?.isSame(moment(initialData.days[0].startTime))).toBeTruthy();
    });
});

describe("getTimelineEndTime", () => {
    it('adds a day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const timeLineStartTime = agendaViewModel.getTimeLineEndTime();
        expect(timeLineStartTime?.isSame(moment(initialData.days[0].endTime))).toBeTruthy();
    });
});

describe("selectItemsWithShift", () => {
    it('works with first selected', () => {
        const initialData = getTestData();
        const firstItem = initialData.days[0].tracks[0].items[0];
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.selectItemsWithShift(firstItem.id)
        expect(agendaViewModel.getItem(firstItem.id)?.uiState).toBe(ItemUIState.Selected);
    });
    it('selects multiple', () => {
        const initialData = getTestData();
        const firstItem = initialData.days[0].tracks[0].items[0];
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.selectItemsWithShift(firstItem.id);
        const thirdItem = initialData.days[0].tracks[0].items[2];
        agendaViewModel.selectItemsWithShift(thirdItem.id);
        const secondItem = initialData.days[0].tracks[0].items[1];
        expect(agendaViewModel.getItem(secondItem.id)?.uiState).toBe(ItemUIState.Selected);
    });
});

describe("addItem", () => {
    it('adds the Item', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        const newId = uuid()
        const newItem: IItem = {id: newId, start: moment(initialData.days[0].startTime).add(5, 'hours'), end: moment(initialData.days[0].startTime).add(6, 'hours')}
        agendaViewModel.addItem(newItem, initialData.days[0].tracks[0].id);
        expect(agendaViewModel.getItem(newId)).toBeDefined();
    });
});


describe("updateItem", () => {
    it('updates the item', () => {
        const initialData = getTestData();
        const firstItem = initialData.days[0].tracks[0].items[0];
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.updateItem(firstItem.id, {title: 'newTitle'});
        expect(agendaViewModel.getItem(firstItem.id)?.title).toBe('newTitle');
        agendaViewModel.updateItem(firstItem.id, {speaker: 'newSpeaker'});
        expect(agendaViewModel.getItem(firstItem.id)?.speaker).toBe('newSpeaker');
        agendaViewModel.updateItem(firstItem.id, {description: 'newDesc'});
        expect(agendaViewModel.getItem(firstItem.id)?.description).toBe('newDesc');
    });
});

describe("moveItem", () => {
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


describe("getDaysToReveal", () => {
    it('reveals the right day', () => {
        const initialData = getTestData();
        const agendaViewModel = new AgendaViewModel(initialData);
        agendaViewModel.setDayUiHidden(initialData.days[2].id, true);
        agendaViewModel.setTotalTracksWidth(2000);
        const daysToReveal = agendaViewModel.getDaysToReveal(1);
        expect(daysToReveal[0].id).toEqual(initialData.days[2].id);
    });
});


