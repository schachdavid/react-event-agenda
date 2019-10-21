import React, { useState } from 'react';
import AgendaItemView from './AgendaItemView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import AgendaItemEditView from './AgendaItemEdit/AgendaItemEditView';
import { Item } from '../../../types/types';
import { useViewModelContext } from '../../../ViewModelContext';
import moment, { Moment } from 'moment';
import AgendaItemCustomDragLayer from './AgendaItemCustomDragLayer';



interface IProps {
    item: Item
}




const AgendaItemController: React.FC<IProps> = ({ item }: IProps) => {
    const viewModel = useViewModelContext();
    const [hovering, setHovering] = useState(false); // TODO: move into mobx state
    const [dragging, setDragging] = useState(false); // TODO: move into mobx state
    const [editing, setEditing] = useState(false); // TODO: move into mobx state

    const deleteItem = () => {
        viewModel.deleteItem(item.itemId)
    };

    const editItem = () => {
        setEditing(true);
    };

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();
    let startTimeTrack: Moment = moment(viewModel.getStartTime());
    startTimeTrack.year(item.start.get('year'));
    startTimeTrack.month(item.start.get('month'));
    startTimeTrack.date(item.start.get('date'));

    const topMin: number = moment.duration(item.start.diff(startTimeTrack)).asMinutes();
    const topPx: number = topMin / intervalInMin * intervalPxHeight;

    const itemDuration: number = moment.duration(item.end.diff(item.start)).asMinutes();
    const height = itemDuration / intervalInMin * intervalPxHeight;

    const small = height == intervalPxHeight ? true : false;


    return editing ?
        <AgendaItemEditView
            start={item.start.format("HH:mm")}
            end={item.end.format("HH:mm")}
            title={item.title}
            speaker={item.speaker}
            height={height}
            topPx={topPx}
            cancelEditing={() => setEditing(false)} />
        : <div>
            <AgendaItemCustomDragLayer height={height}></AgendaItemCustomDragLayer>

            <AgendaItemView
                start={item.start.format("HH:mm")}
                end={item.end.format("HH:mm")}
                title={item.title}
                speaker={item.speaker}
                topPx={topPx}
                height={height}
                small={small}
                hovering={hovering}
                dragging={dragging}
                editItem={() => editItem()}
                deleteItem={() => deleteItem()}
                onMouseEnter={() => { setHovering(true) }}
                onMouseLeave={() => { setHovering(false) }}
                onDragStart={(ev: any) => { ev.dataTransfer.setData("text", "sfefs"); setDragging(true); setHovering(false); }}
                onDragEnd={() => setDragging(false)}
            />
        </div>

}


export const AgendaItem = observer(AgendaItemController);
