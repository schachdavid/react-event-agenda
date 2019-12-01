import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemView.module.scss';
import classNames from 'classnames';
import { IconButton, createTheme } from 'office-ui-fabric-react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Customizer } from 'office-ui-fabric-react';
import color from 'color';
import { useColorPaletteContext } from '../../hooks/ColorPaletteContext';
import { invertTheme } from '../../util';
// import { invertTheme } from '../../../util';


export interface IProps {
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    location?: string,
    topPx: number,
    height: number,
    small: boolean,
    enableHover: boolean,
    selecting: boolean,
    selected: boolean,
    handleSelectClick: (event: any) => void,
    resizing?: boolean,
    dragging: boolean,
    dragRef: any,
    // resizeEndRef: any,
    hideTitle?: boolean,
    hideSpeaker?: boolean,
    hideLocation?: boolean,
    initResizing: () => void,
    handleResizeEndTime: (diff: number) => void,
    finishResizeEndTime: () => void,
    editItem: () => void,
    deleteItem: () => void,
    onMouseEnter?: (e: any) => any,
    onMouseLeave?: (e: any) => any,
    customActionButtons?: Array<JSX.Element>
}

const AgendaItemView: React.FC<IProps> = ({
    start,
    end,
    title,
    speaker,
    topPx,
    height,
    small,
    enableHover,
    initResizing,
    handleResizeEndTime,
    finishResizeEndTime,
    editItem,
    deleteItem,
    dragging,
    dragRef,
    selected,
    handleSelectClick,
    selecting,
    customActionButtons
}: IProps) => {

    const colorPalette = useColorPaletteContext();


    let initialMousePosition: number;
    const initializeResizing = (e?: undefined | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        initResizing();
        document.body.style.cursor = "ns-resize";
        if (e) {
            e.preventDefault();
            initialMousePosition = e.clientY;
        }
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    const resize = (e: any) => {
        let diff: number = e.clientY - initialMousePosition;
        handleResizeEndTime(diff);

    }

    const stopResize = () => {
        window.removeEventListener('mousemove', resize); //TODO: throttle here
        window.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = "auto";
        finishResizeEndTime();
    }

    // const hoverColor = selected ? color(colorPalette.themePrimary).darken(0.1).toString() : color(colorPalette.themePrimary).alpha(0.6).toString();
    const normalColor = selected ? colorPalette.themePrimary : color(colorPalette.themePrimary).alpha(0.5).toString();

    const newColorPalette = Object.assign({}, colorPalette);

    const whiteTmp = newColorPalette.white

    //background color
    newColorPalette.white = newColorPalette.themePrimary;

    //icon color
    newColorPalette.themePrimary = newColorPalette.themeDarker;

    //hover background color
    newColorPalette.neutralLighter = normalColor;

    // font color
    newColorPalette.neutralPrimary = whiteTmp;

    //hover icon color
    newColorPalette.themeDarkAlt = newColorPalette.themeDarker;;

    // hover font color
    newColorPalette.neutralDark = whiteTmp;

    const theme = createTheme({
        palette: newColorPalette
    });

    const themeSelected = invertTheme(colorPalette);

    const controls = enableHover ?
        <div className={!small ? styles.controls : styles.controlsSmall} >
            <Stack tokens={{ childrenGap: 2, maxWidth: '50%'  }} horizontal>
                <Customizer settings={{ theme: theme }}>
                    <IconButton iconProps={{ iconName: "Delete" }} onClick={e => {
                        e.stopPropagation();
                        deleteItem();
                    }} />

                    {customActionButtons}
                    <IconButton iconProps={{ iconName: "Edit" }} onClick={e => {
                        e.stopPropagation();
                        editItem();
                    }} />
                    <IconButton iconProps={{ iconName: "Checkbox" }} onClick={e => {
                        e.stopPropagation();
                        handleSelectClick(e)
                    }} />
                </Customizer>
            </Stack>
        </div>
        : null;

    const checkIcon = selecting ?
        <div className={!small ? styles.selectIcon : null} >
            <Stack tokens={{ childrenGap: 2 }} horizontal>
                <Customizer settings={{ theme: selected ? themeSelected : theme }}><IconButton iconProps={{ iconName: selected ? "CheckboxCompositeReversed" : "Checkbox" }} onClick={e => {
                    e.stopPropagation();
                    handleSelectClick(e)
                }} /></Customizer>
            </Stack>
        </div>
        : null;



    const resizeHandleBar = enableHover ?
        <div className={styles.resizeHandleBarContainer} onMouseDown={initializeResizing}>
            <div className={styles.resizeHandleBar} >
                <div className={styles.resizeHandleBarLine} />
                <div className={styles.resizeHandleBarLine} />
            </div>
        </div>
        : null;


    return (
        dragging ?
            <div className={styles.container} style={{ top: topPx, height: height }} >
                <div className={styles.shadow} />
            </div>
            :
            <div className={classNames(styles.container)} style={{ top: topPx, height: height }} >
                <div
                    ref={dragRef}
                    onClick={selecting ? handleSelectClick : editItem}
                    style={{ backgroundColor: normalColor }}
                    className={classNames(styles.main, {
                        [styles.mainHover]: enableHover,
                        [styles.mainSelected]: selected,
                    })} >

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
                            {controls}
                            {checkIcon}
                        </div>
                        :
                        <div className={classNames(styles.contentSmall, styles.content)}>
                            <div className={styles.titleSmall}>
                                {title ? title : "(No title)"}
                            </div>
                            {controls}
                            {checkIcon}
                        </div>
                    }
                </div>
                {resizeHandleBar}
            </div>



    );
}



export default observer(AgendaItemView);
