import { observable, action } from 'mobx';


export enum UIState {
    Moving,
    Resizing,
    Creating,
    Editing,
    Normal
}

class UIStore {
    @observable uiState: UIState = UIState.Normal;

    @action setUiState(newState: UIState) {
        this.uiState = newState;
    }

    getUiState() {
        return this.uiState;
    }
  
}

export default UIStore;
