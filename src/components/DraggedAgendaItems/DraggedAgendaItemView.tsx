import React from 'react';
import styles from '../AgendaItem/AgendaItemView.module.scss';
import { useColorPaletteContext } from '../../hooks/ColorPaletteContext';
import color from 'color';
import { observer } from 'mobx-react';
import classNames from 'classnames';



export interface IProps {
    height: number,
    width: number,
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    small?: boolean,
    offsetX: number,
    offsetY: number

}

const DraggedAgendaItemView: React.FC<IProps> = ({
    height,
    width,
    start,
    end,
    title,
    speaker,
    small,
    offsetX,
    offsetY }) => {



    const colorPalette = useColorPaletteContext();



    return (

        <div className={styles.container} style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'fixed',
            pointerEvents: 'none',
            top: 0,
            left: 0,
            zIndex: 200,
            transform: `translate(${offsetX}px, ${offsetY}px)`
        }} >
            <div className={styles.mainDrag} style={{ backgroundColor: color(colorPalette.themePrimary).alpha(0.7).toString() }} >
                {!small ?
                    <div className={styles.content}>
                        <div>
                            {start} - {end}
                        </div>
                        <div className={classNames(styles.title, styles.textWrap)}>
                            {title ? title : "(No title)"}
                        </div>
                        <div className={styles.textWrap}>
                            {speaker}
                        </div>
                    </div>
                    :
                    <div className={classNames(styles.contentSmall, styles.content)}>
                        <div className={styles.titleSmall}>
                            {title ? title : "(No title)"}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}


export default observer(DraggedAgendaItemView);
