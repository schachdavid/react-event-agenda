import React, { useEffect, useCallback } from 'react';
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
    topPx: number,
    height: number,
    save: () => void,
    cancelEditing: () => void
}

const AgendaItemEditView: React.FC<IProps> = ({
    start,
    setTitle,
    title,
    end,
    speaker,
    setSpeaker,
    topPx,
    save,
    cancelEditing }: IProps) => {

        useEffect(() => {
            document.addEventListener("keydown", handleKeyPress, false);
            return () => {
              document.removeEventListener("keydown", handleKeyPress, false);
            };
          }, []);

        const firstInputRef = useCallback(node => {
            if (node) {
                node.focus();
            }
            return;
        }, []);

        const containerRef = useCallback((node: HTMLElement | null) => {
            if (node) {
                node.scrollIntoView({block: "nearest", behavior: "smooth"});
            }
            return;
        }, []);


        
        

    const handleKeyPress = (event: any) => {
        if(event.keyCode === 27) {  
            event.preventDefault();
            event.stopPropagation();
            cancelEditing();

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

    const titleTextField = setTitle ? <TextField componentRef={getRef()} placeholder="Add title" value={title} onChange={(e:any) => setTitle(e.target.value)} underlined /> : null;

    const speakerTextField = setSpeaker ? <TextField componentRef={getRef()} placeholder="Add speakers" value={speaker}  onChange={(e:any) => setSpeaker(e.target.value)} underlined /> : null;


    return (
        <div className={styles.container} ref={containerRef} style={{ top: topPx }} >
            <div className={styles.main}>
                <div className={styles.content}>
                    <div>
                        {start} - {end}
                    </div>
                    <form onSubmit={() => save()}>
                        {titleTextField}
                        {speakerTextField}
                        <TextField placeholder="Add additional Description" multiline resizable={false} underlined />
                        <PrimaryButton type="submit" text="Save" allowDisabledFocus className={styles.saveButton} onClick={save} />
                        {controls}
                    </form>
             
                </div>
            </div>
            <div className={styles.background} onClick={cancelEditing}>

            </div>
        </div>

    );
}

export default observer(AgendaItemEditView);
