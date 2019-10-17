import { observable, action, autorun, toJS, IObservableArray } from 'mobx';

class UIModel {
    @observable hiddenItemKeys: IObservableArray<string> = observable<string>([]);


    constructor() {
        autorun(() => console.log(toJS(this.hiddenItemKeys)));
    }

    @action addHiddenItemKey(hiddenItemKey: string) {
        this.hiddenItemKeys.push(hiddenItemKey);
    }

    @action removeHiddenItemKey(hiddenItemKey: string) {
        this.hiddenItemKeys.remove(hiddenItemKey);
    }

    getHiddenItemKeys() {
        return this.hiddenItemKeys;
    }

    hiddenItemContainsKey(key: string) {
        return this.hiddenItemKeys.find((curKey) => curKey === key) ? true : false;
    }

}

export default UIModel;