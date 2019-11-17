import React, { useState } from 'react';
import { observer } from "mobx-react";
import AgendaItemEditView from './AgendaItemEditView';
import { IItem } from '../../../models/ItemModel';
import { useViewModelContext } from '../../../hooks/ViewModelContext';



interface IProps {
    item: IItem,
    height: number,
    topPx: number,
    cancel: () => void
}




const AgendaItemEditController: React.FC<IProps> = ({ item, height, topPx, cancel }: IProps) => {
    const viewModel = useViewModelContext();
    const [title, setTitle] = useState(item.title);
    const [speaker, setSpeaker] = useState(item.speaker);

    


    return <AgendaItemEditView
            start={item.start.format("HH:mm")}
            end={item.end.format("HH:mm")}
            title={title}
            setTitle={setTitle}
            speaker={speaker}
            setSpeaker={setSpeaker}
            height={height}
            topPx={topPx}
            save={() =>{ 
                    viewModel.updateItem(item.id, {title: title, speaker: speaker});
                    cancel();
                }}
            cancelEditing={cancel} />

}


export const AgendaItemEdit = observer(AgendaItemEditController);
