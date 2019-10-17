import DataModel from './models/DataModel';
import UIModel from './models/UIModel';
import ListItem from './types/dataTypes';
import { action } from 'mobx';



class AgendaViewModel {
    dataStore: DataModel;
    uiStore: UIModel;
    
    constructor() {
        this.dataStore = new DataModel();
        this.uiStore = new UIModel();
    }

    getListStore() {
        return this.dataStore;
    }

    getListItems() {
        return this.dataStore.getListItems();
    }

    addListItem(listItem: string) {
        this.dataStore.addListItem(listItem);
    }

    undo() {
        this.dataStore.undo();
    }

    redo() {
        this.dataStore.redo();
    }

    getHiddenKeys() {
        this.uiStore.getHiddenItemKeys();
    }


    @action hideItem(item: ListItem) {
        let itemToHide: ListItem = this.dataStore.findItem(item);
        if (itemToHide) {
            if (!itemToHide.ui) {
                itemToHide.ui = {};
            } 
            itemToHide.ui.hidden = true;
        }
    }


    @action revealItem(item: ListItem) {
        let itemToReveal: ListItem = this.dataStore.findItem(item);
        if (itemToReveal) {
            if (!itemToReveal.ui) {
                itemToReveal.ui = {};
            } 
            delete itemToReveal.ui["hidden"];
        }
    }

    // hideItem(item: ListItem) {
    //     // this.uiStore.addHiddenItemKey(item.id);
    //     this.dataStore.hideItem(item);
    // }

    // revealItem(item: ListItem) {
    //     // this.uiStore.removeHiddenItemKey(item.id);
    //     this.dataStore.revealItem(item);
    // }

    isHidden(item: ListItem) {
        // return this.uiStore.hiddenItemContainsKey(item.id);
        return this.dataStore.isHidden(item);
    }
}

export default AgendaViewModel;