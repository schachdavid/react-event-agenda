import { observable, action, autorun, toJS, IObservableArray } from 'mobx';
import {ListItem, ListItemData } from '../types/dataTypes';
import uuid from 'uuid';


class DataModel {
    @observable listItems: IObservableArray<ListItem> = observable<ListItem>([]);
    listItemsHistory: Array<Array<ListItemData>> = [];
    pointer: number = -1;

    constructor() {
        autorun(() => console.log(toJS(this.listItems), this.pointer));
    }

    @action addListItem(listItemText: string) {
        const id: string = uuid();

        this.listItems.push(
            {
                "text": listItemText,
                "id": id,
            }
        )
        this.pushToHistory();
    }



    @action setListItemsData(newListItems: Array<ListItem>) {
        this.listItems.replace(newListItems);
    }


    getListItems() {
        return this.listItems;
    }

    getSelectedListItems() {
        return this.listItems;
    }

    pushToHistory() {
        this.pointer++;
        this.listItemsHistory.splice(this.pointer, this.listItemsHistory.length);
        this.listItemsHistory.push(toJS(this.listItems));

    }

    @action undo() {
        if (this.pointer >= 0) {
            this.pointer--;
            this.setListItemsData(this.listItemsHistory[this.pointer]);
        }
    }

    @action redo() {
        if (this.pointer < this.listItemsHistory.length - 1) {
            this.pointer++;
            this.setListItemsData(this.listItemsHistory[this.pointer]);
        }
    }

    findItem(item: ListItem) {
        let foundItem: ListItem | undefined = this.listItems.find((curItem) => curItem.id === item.id);
        if (!foundItem) {
            throw new Error('ListItem not not found');
          }
          return foundItem;
    }

    


    isHidden(item: ListItem) {
        let foundItem: ListItem = this.findItem(item);
        return foundItem.ui && foundItem.ui.hidden ? true : false;
    }


    





}

export default DataModel;