import React, { useState, useEffect, useCallback } from 'react';
import AgendaItemView from './AgendaItemView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import AgendaItemEditView from './AgendaItemEdit/AgendaItemEditView';
import { IItem } from '../../../models/ItemModel';
import { useViewModelContext } from '../../../ViewModelContext';
import moment, { Moment } from 'moment';
import AgendaItemDragView from './AgendaItemDragView';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'



interface IProps {
    item: IItem
}




const AgendaItemController: React.FC<IProps> = ({ item }: IProps) => {
    const viewModel = useViewModelContext();
    const [hovering, setHovering] = useState(false); // TODO: move into mobx state
    const [editing, setEditing] = useState(false); // TODO: move into mobx state
    const [resizing, setResizing] = useState(false); // TODO: move into mobx state

    const [width, setWidth] = useState(0);



    const refWidthContainer = useCallback(node => {
        if (node !== null) {
            setWidth(node.clientWidth - 1);
            const handleWidthResize = () => {
                if (node.clientWidth != width) {
                    setWidth(node.clientWidth);
                }
            }
            window.addEventListener('resize', handleWidthResize);
            return () => { window.removeEventListener('resize', handleWidthResize) };
        }
        return;
    }, []);

    const [{ isDragging }, dragMoveRef, previewMove] = useDrag({
        item: { type: "item", id: item.id },
        isDragging: monitor => monitor.getItem().id === item.id,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
        begin: () => {
            setHovering(false);
        },
        end: () => {            
            viewModel.pushToHistory(); //TODO: does not really work yet, only push to history if item actually changed
        }
    })

    useEffect(() => {
        previewMove(getEmptyImage(), { captureDraggingState: true });
    }, [])

    const deleteItem = () => {
        viewModel.deleteItem(item.id, true)
    };

    const editItem = () => {
        setEditing(true);
    };

    let initialEndTime = moment(item.end);
    const initResizing = () => {
        setResizing(true);
    }


    const handleResizeEndTime = (diff: number) => {
        const minutes = Math.round(diff / intervalPxHeight) * intervalInMin;
        const newEnd: Moment = moment(initialEndTime).add('minutes', minutes);
        if(!item.end.isSame(newEnd)) {
            viewModel.adjustItemEndTime(item.id, newEnd);
        }
    }

    const finishResizeEndTime = () => {
        setResizing(false);
        if (!initialEndTime.isSame(item.end)) {
            initialEndTime = item.end;
            viewModel.pushToHistory();
        }
    }

    let initialStartTime = moment(item.start);
    const handleResizeStartTime = (diff: number) => {
        const minutes = Math.round(diff / intervalPxHeight) * intervalInMin;
        const newStart: Moment = moment(initialStartTime).add('minutes', minutes);
        if (!newStart.isSame(item.start)) viewModel.adjustItemStartTime(item.id, newStart);
        setResizing(true);
    }

    const finishResizeStartTime = () => {
        setResizing(false);
        if (!initialStartTime.isSame(item.start)) {
            initialStartTime = item.start;
            viewModel.pushToHistory();
        }
    }


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
            <AgendaItemDragView
                id={item.id}
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
                resizing={resizing}
                dragRef={dragMoveRef}
                initResizing={initResizing}
                handleResizeEndTime={handleResizeEndTime}
                finishResizeEndTime={finishResizeEndTime}
                handleResizeStartTime={handleResizeStartTime}
                finishResizeStartTime={finishResizeStartTime}
                editItem={() => editItem()}
                deleteItem={() => deleteItem()}
                onMouseEnter={() => { setHovering(true) }}
                onMouseLeave={() => { setHovering(false) }}
            />
        </div>

}


export const AgendaItem = observer(AgendaItemController);
