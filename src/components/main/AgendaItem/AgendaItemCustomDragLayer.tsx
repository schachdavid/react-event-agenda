import React from 'react';

import { useDragLayer } from "react-dnd";


export interface IProps {
    height: number,

}

const AgendaItemCustomDragLayer: React.FC<IProps> = ({height}) => {
    const {
        isDragging,
        currentOffset,
    } = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        // initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
    }))


    console.log('is dragging custom: ', isDragging);
    console.log('currentOffset :', currentOffset)


    if (!isDragging || !currentOffset) {
        return null
    }



    return (

        <div style={{
            height: {height}+'px',
            width: '200px',
            backgroundColor: 'green',
            position: 'absolute',
            zIndex: 999,
            top: 0,
            left: 0,
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
        }}>
            sefsefsefsef
  
      </div>

    )
}


export default AgendaItemCustomDragLayer;

