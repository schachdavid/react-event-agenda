import React from 'react';
import {AgendaViewModel} from './AgendaViewModel';


const ViewModelContext = React.createContext<AgendaViewModel | null>(null);

export const ViewModelProvider = ViewModelContext.Provider;
export const ViewModelConsumer = ViewModelContext.Consumer;
export const useViewModelContext = () => {
    const viewModel = React.useContext(ViewModelContext);
    if (!viewModel) {
      throw new Error('useViewModelContext must be used within a StoreProvider.');
    }
    return viewModel;
  }

export default ViewModelContext;
