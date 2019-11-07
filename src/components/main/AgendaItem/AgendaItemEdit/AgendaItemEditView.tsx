import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemEditView.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, IconButton } from 'office-ui-fabric-react';





export interface IProps {
    start: string,
    end: string,
    title?: string,
    speaker?: string,
    topPx: number,
    height: number,
    save: () => void,
    cancelEditing: () => void
}

const AgendaItemEditView: React.FC<IProps> = ({
    start,
    end,
    title,
    speaker,
    topPx,
    height,
    save,
    cancelEditing }: IProps) => {

    const controls = <div className={styles.cancelButton}>
        <IconButton iconProps={{ iconName: "Cancel" }} onClick={cancelEditing} />
    </div>
        ;

    return (
        <div className={styles.container} style={{ top: topPx, minHeight: height }} >
            <div className={styles.main}>
                <div className={styles.content}>
                    <div>
                        {start} - {end}
                    </div>
                    <TextField placeholder="Add a title" value={title} underlined />
                    <TextField placeholder="Add speakers" value={speaker} underlined />
                    <TextField placeholder="Add a location" underlined />
                    <PrimaryButton text="Save" allowDisabledFocus className={styles.saveButton} onClick={save} />
                    {controls}
                </div>
            </div>
            <div className={styles.background} onClick={cancelEditing}>

            </div>
        </div>

    );
}

export default observer(AgendaItemEditView);
