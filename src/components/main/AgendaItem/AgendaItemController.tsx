import React, { useState, useEffect, useCallback } from 'react';
import AgendaItemView from './AgendaItemView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";
import { IItem, ItemUIState } from '../../../models/ItemModel';
import { useViewModelContext } from '../../../hooks/ViewModelContext';
import moment, { Moment } from 'moment';
import AgendaItemDragView from './AgendaItemDragView';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'
import { AgendaItemEdit } from './AgendaItemEdit/AgendaItemEditController';
import { IconButton } from 'office-ui-fabric-react';
import { ICustomItemAction } from '../../../interfaces/agendaProps';
import { UIState } from '../../../models/UIStore';



interface IProps {
    item: IItem,
    customItemActions?: Array<ICustomItemAction>
}




const AgendaItemController: React.FC<IProps> = ({ item, customItemActions }: IProps) => {
    const viewModel = useViewModelContext();
    const [hovering, setHovering] = useState(false); // TODO: move into mobx state
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
            viewModel.setUIState(UIState.Moving);
            viewModel.pushToHistory();
        },
        end: () => {
            viewModel.setUIState(UIState.Normal);
        }
    })

    useEffect(() => {
        previewMove(getEmptyImage(), { captureDraggingState: true });
    }, [])

    const deleteItem = () => {
        viewModel.deleteItem(item.id)
    };

    const editItem = () => {
        viewModel.updateItemUIState(item.id, ItemUIState.Editing)
    };

    let initialEndTime = moment(item.end);
    const initResizing = () => {
        setResizing(true);
        viewModel.setUIState(UIState.Resizing);
    }


    const handleResizeEndTime = (diff: number) => {
        const minutes = Math.round(diff / intervalPxHeight) * intervalInMin;
        const newEnd: Moment = moment(initialEndTime).add(minutes, 'minutes');
        if (!item.end.isSame(newEnd)) {
            viewModel.adjustItemEndTime(item.id, newEnd);
        }
    }

    const finishResizeEndTime = () => {
        setResizing(false);
        viewModel.setUIState(UIState.Normal);
        if (!initialEndTime.isSame(item.end)) {
            initialEndTime = item.end;
            viewModel.pushToHistory();
        }
    }

    let initialStartTime = moment(item.start);
    const handleResizeStartTime = (diff: number) => {
        const minutes = Math.round(diff / intervalPxHeight) * intervalInMin;
        const newStart: Moment = moment(initialStartTime).add(minutes, 'minutes');
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
    const day = viewModel.getDayForItem(item.id);
    let timeLineStartTimeTmp = viewModel.getTimeLineStartTime(day ? day.startTime : undefined);


    let timeLineStartTime: Moment = timeLineStartTimeTmp ? timeLineStartTimeTmp : moment();

    const topMin: number = moment.duration(item.start.diff(timeLineStartTime)).asMinutes();
    const topPx: number = topMin / intervalInMin * intervalPxHeight;

    const itemDuration: number = moment.duration(item.end.diff(item.start)).asMinutes();
    const height = itemDuration / intervalInMin * intervalPxHeight;

    const small = height == intervalPxHeight ? true : false;



    const agendaItemEdit = item.uiState !== undefined && (item.uiState === ItemUIState.Editing) ?
        <AgendaItemEdit
            item={item}
            height={height}
            topPx={topPx}
            cancel={() => viewModel.updateItemUIState(item.id, undefined)} />
        : null;


    const customActionButtons = customItemActions ? customItemActions.map((customAction =>
        <IconButton
            iconProps={{ iconName: customAction.iconName }}
            key={customAction.iconName}
            onClick={(e: any) => {
                e.stopPropagation();
                customAction.action(item);
            }} />
    )) : undefined;


    return <>
        {agendaItemEdit}
        <div>
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
                onMouseEnter={() => { if (!resizing) setHovering(true) }}
                onMouseLeave={() => { if (!resizing) setHovering(false) }}
                customActionButtons={customActionButtons}
            />
        </div>
    </>

}


export const AgendaItem = observer(AgendaItemController);
