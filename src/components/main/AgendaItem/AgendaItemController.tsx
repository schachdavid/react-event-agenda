import React, { useState, useEffect, useCallback } from 'react';
import AgendaItemView from './AgendaItemView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import AgendaItemEditView from './AgendaItemEdit/AgendaItemEditView';
import { Item } from '../../../interfaces/modelnterfaces';
import { useViewModelContext } from '../../../ViewModelContext';
import moment, { Moment } from 'moment';
import AgendaItemDragView from './AgendaItemDragView';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'



interface IProps {
    item: Item
}




const AgendaItemController: React.FC<IProps> = ({ item }: IProps) => {
    const viewModel = useViewModelContext();
    const [hovering, setHovering] = useState(false); // TODO: move into mobx state
    const [editing, setEditing] = useState(false); // TODO: move into mobx state
    const [width, setWidth] = useState(0);


    const refWidthContainer = useCallback(node => {
        if (node !== null) {
            setWidth(node.clientWidth - 1);

            const handleResize = () => {
                if (node.clientWidth != width) {
                    setWidth(node.clientWidth);
                }
            }
            window.addEventListener('resize', handleResize);
            return () => { window.removeEventListener('resize', handleResize) };
        }
        return;
    }, []);

    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: "item", itemId: item.itemId },
        isDragging: monitor => monitor.getItem().itemId === item.itemId,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
        begin: () => {
            setHovering(false);        },
        end: () => {
            viewModel.pushToHistory(); //TODO: only push to history if item actually changed, maybe do this
        }

    })

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

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

    console.log('topPx: ' + topPx);
    console.log('topPx: ' + topPx);

    


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
            <AgendaItemDragView
                itemId={item.itemId}
                height={height}
                width={width}
                start={item.start.format("HH:mm")}
                end={item.end.format("HH:mm")}
                title={item.title}
                speaker={item.speaker}
                small={small}
            />
            <div ref={refWidthContainer} style={{ width: '100%' }}></div>

            <AgendaItemView
                start={item.start.format("HH:mm")}
                end={item.end.format("HH:mm")}
                title={item.title}
                speaker={item.speaker}
                topPx={topPx}
                height={height}
                small={small}
                hovering={hovering}
                dragging={isDragging}
                dragRef={drag}
                editItem={() => editItem()}
                deleteItem={() => deleteItem()}
                onMouseEnter={() => { setHovering(true) }}
                onMouseLeave={() => { setHovering(false) }}
            />
        </div>

}


export const AgendaItem = observer(AgendaItemController);
