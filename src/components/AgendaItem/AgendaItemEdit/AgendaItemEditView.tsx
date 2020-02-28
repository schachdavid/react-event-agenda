import React, { useCallback } from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemEditView.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, IconButton } from 'office-ui-fabric-react';


export interface IProps {
    start: string,
    end: string,
    title?: string,
    setTitle?: (newTitle: string) => void,
    speaker?: string,
    setSpeaker?: (newSpeaker: string) => void,
    description?: string,
    setDescription?: (newDescription: string) => void,
    topPx: number,
    height: number,
    save: () => void,
    cancelEditing: () => void
}

const AgendaItemEditView: React.FC<IProps> = ({
    setTitle,
    title,
    speaker,
    setSpeaker,
    description,
    setDescription,
    topPx,
    save,
    cancelEditing }: IProps) => {

  
    const firstInputRef = useCallback(node => {
        if (node) {
            node.focus();
        }
        return;
    }, []);

    const containerRef = useCallback((node: HTMLElement | null) => {
        if (node) {
            node.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
        return;
    }, []);


    const handleKeyPress = (event: any) => {
        if (event.keyCode === 27) {
            event.preventDefault();
            event.stopPropagation();
            cancelEditing();
        }
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            save();
        }
    }


    const controls = <div className={styles.cancelButton}>
        <IconButton iconProps={{ iconName: "Cancel" }} onClick={cancelEditing} />
    </div>
        ;



    let firstInputReferenced = false;

    const getRef = () => {
        if (firstInputReferenced) return undefined;
        firstInputReferenced = true;
        return firstInputRef;
    }

    const titleTextField = setTitle ? <TextField componentRef={getRef()} placeholder="Add title" value={title} onChange={(e: any) => setTitle(e.target.value)} underlined /> : null;

    const speakerTextField = setSpeaker ? <TextField componentRef={getRef()} placeholder="Add speakers" value={speaker} onChange={(e: any) => setSpeaker(e.target.value)} underlined /> : null;

    const descriptionTextField = setDescription ? <TextField placeholder="Add additional Description" multiline resizable={false} value={description} onChange={(e: any) => setDescription(e.target.value)} underlined /> : null;


    return (
        <div className={styles.container} ref={containerRef} style={{ top: topPx }} >
            <div className={styles.main}>
                <div className={styles.content} onKeyDown={handleKeyPress}>
                    <div className={styles.editTitle}>
                        Edit Item
                    </div>
                        {titleTextField}
                        {speakerTextField}
                        {descriptionTextField}
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
