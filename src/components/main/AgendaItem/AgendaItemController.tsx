import React, { ReactChild, useState, useEffect } from 'react';
import { IProps as IViewProps } from './AgendaItemView';
// import { useViewModelContext } from '../../ViewModelContext';
import { observer } from "mobx-react";



interface IProps {
    children: (viewProps: IViewProps) => ReactChild
}



const AgendaItemController: React.FC<IProps> = ({ children }: IProps) => {
    // const viewModel = useViewModelContext();
    const [hovering, setHovering] = useState(false); // TODO: move into mobx state
    const [dragging, setDragging] = useState(false); // TODO: move into mobx state
    const [editing, setEditing] = useState(false); // TODO: move into mobx state

    const [topPx, setTopPx] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setTopPx(getRandomInt(0, 6) * 5 * 24);
        setHeight(getRandomInt(4, 10) * 24);
      }, [])




    return children({
        topPx: topPx,
        height: height,
        editing: editing,
        hovering: hovering,
        dragging: dragging,
        setEditing: setEditing,
        onMouseEnter: () => { setHovering(true) },
        onMouseLeave: () => { setHovering(false) },
        onDragStart: (ev: any) => {  ev.dataTransfer.setData("text", "sfefs"); setDragging(true); setHovering(false); },
        onDragEnd:() => { setDragging(false); },

    }) as React.ReactElement<any>;
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default observer(AgendaItemController);
