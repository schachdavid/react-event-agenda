import { observable, action } from 'mobx';


export enum UIState {
    Moving,
    Selecting,
    Resizing,
    Creating,
    Editing,
    Normal
}

class UIStore {
    @observable uiState: UIState = UIState.Normal;
    @observable selectHistory: Array<string> = []; //needed for badge selecting using shift key
    @observable totalTracksWidth: number = 0;
    @observable trackWidth: number = 0;


    getUiState() {
        return this.uiState;
    }

    @action setUiState(newState: UIState) {
        this.uiState = newState;
    }

    getSelectHistory() {
        return this.selectHistory;
    }

    @action setSelectHistory(newSelectHistory: Array<string>) {
        this.selectHistory = newSelectHistory;
    }

    getTotalTracksWidth() {
        return this.totalTracksWidth;
    }

    @action setTotalTracksWidth(value: number) {
        this.totalTracksWidth = value;
    }

  
}

export default UIStore;
