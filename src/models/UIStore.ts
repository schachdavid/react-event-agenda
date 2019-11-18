import { observable, action } from 'mobx';
import { Store } from 'mmlpx';


export enum UIState {
    Moving,
    Selecting,
    Resizing,
    Creating,
    Editing,
    Normal
}


@Store
class UIStore {
    @observable uiState: UIState = UIState.Normal;
    @observable selectHistory: Array<string> = []; //needed for badge selecting using shift key


    @action setUiState(newState: UIState) {
        this.uiState = newState;
    }

    getUiState() {
        return this.uiState;
    }

    getSelectHistory() {
        return this.selectHistory;
    }

    @action setSelectHistory(newSelectHistory: Array<string>) {
        this.selectHistory = newSelectHistory;
    }

  
}

export default UIStore;
