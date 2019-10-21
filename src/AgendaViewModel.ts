import ItemsModel from './models/AgendaModel';
import UIModel from './models/UIModel';
import AgendaViewModelInterface from './AgendaViewModelInterface';
// import ListItem from './types/dataTypes';
// import { action } from 'mobx';



class AgendaViewModel implements AgendaViewModelInterface {
    itemsStore: ItemsModel;
    uiStore: UIModel;
    
    constructor() {
        this.itemsStore = new ItemsModel();
        this.uiStore = new UIModel();
    }

    getStore() {
        return this.itemsStore;
    }

    getStartTime() {
        return this.itemsStore.getStartTime();

    }

    getEndTime() {
        return this.itemsStore.getEndTime();
    }

    getIntervalPxHeight() {
        return this.itemsStore.getIntervalPxHeight();
    }

    getIntervalInMin() {
        return this.itemsStore.getIntervalInMin();
    }

    getSegmentFactor() {
        return this.itemsStore.getSegmentFactor();
    }

    getDays() {
        return this.itemsStore.getDays();
    }

    deleteItem(itemId: string) {
        this.itemsStore.deleteItem(itemId);
    }

    addItem() {
        // this.itemsStore.addItem(listItem);
    }

    undo() {
        this.itemsStore.undo();
    }

    redo() {
        this.itemsStore.redo();
    }








}

export default AgendaViewModel;