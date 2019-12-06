import React from 'react';
import { useDragLayer } from "react-dnd";
import DraggedAgendaItemView from './DraggedAgendaItemView';
import { useViewModelContext } from '../../hooks/ViewModelContext';
import moment from 'moment';
import { DragObject } from '../../interfaces/dndInterfaces';




export interface IProps {

}

const DraggedAgendaItemsController: React.FC<IProps> = ({ }) => {

    const {
        isDragging,
        dragObject: dragObjectTmp,
        currentOffset,
    } = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        dragObject: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset()
    }))

    const dragObject: DragObject = dragObjectTmp;

    const viewModel = useViewModelContext();

    if (!isDragging || !currentOffset || !dragObject) {
        return null;
    }

    const currentDraggedItemIds: Array<string> = dragObject.itemIds;
    const items = viewModel.getItems(undefined, currentDraggedItemIds);

    const clickedIndex = items.findIndex(item => item.id === dragObject.clickedItemId);

    if (clickedIndex === undefined) return null;

    const intervalPxHeight = viewModel.getIntervalPxHeight();
    const intervalInMin = viewModel.getIntervalInMin();

    const heights: Array<number> = [];
    const offsetsY: Array<number> = [];

    let currentOffsetY = currentOffset.y;
    for (let i = clickedIndex; i >= 0; i--) {
        const item = items[i];
        const itemDuration: number = moment.duration(item.end.diff(item.start)).asMinutes();
        heights[i] = itemDuration / intervalInMin * intervalPxHeight;
        if (i !== clickedIndex) currentOffsetY = currentOffsetY - heights[i];
        offsetsY[i] = currentOffsetY;
    }

    currentOffsetY = currentOffset.y;
    for (let i = clickedIndex + 1; i < items.length; i++) {
        const item = items[i];
        const itemDuration: number = moment.duration(item.end.diff(item.start)).asMinutes();
        heights[i] = itemDuration / intervalInMin * intervalPxHeight;
        currentOffsetY = currentOffsetY + heights[i - 1];
        offsetsY[i] = currentOffsetY;
    }


    const renderedItems: Array<JSX.Element> = [];

    items.forEach((item, index) => {

        const small = heights[index] === intervalPxHeight ? true : false;

        renderedItems.push(
            <DraggedAgendaItemView
                height={heights[index]}
                width={viewModel.getTrackWidth()}
                start={item.start.format("HH:mm")}
                end={item.end.format("HH:mm")}
                offsetX={currentOffset.x}
                offsetY={offsetsY[index]}
                title={item.title}
                speaker={item.speaker}
                small={small}
                key={item.id}
            />
        )
    })


    return (
        <>
            {renderedItems}
        </>
    )
}


export const DraggedAgendaItems = DraggedAgendaItemsController;

