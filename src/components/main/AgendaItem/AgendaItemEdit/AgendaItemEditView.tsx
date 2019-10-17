import React from 'react';
import { observer } from "mobx-react";
import styles from './AgendaItemEditView.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';



// import classNames from 'classnames';
// import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
// import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';



export interface IProps {
    topPx: number,
    height: number,
}

const AgendaItemEditView: React.FC<IProps> = ({
    topPx,
    height,
}: IProps) => {


    const controls = <div className={styles.cancelButton}>
        <Icon iconName="Cancel" className="ms-IconExample" />
    </div>
        ;



    return (
        <div className={styles.container} style={{ top: topPx, minHeight: height }} >
            <div className={styles.main}>
                <div className={styles.content}>
                    <div>
                        10:11 - 10:20
                    </div>
                    <TextField placeholder="Add a title" value="Title" underlined />
                    <TextField placeholder="Add speakers" value="Speaker" underlined />
                    <TextField placeholder="Add a location" underlined />
                    <PrimaryButton text="Save" allowDisabledFocus className={styles.saveButton} />
                    {controls}
                </div>
            </div>
        </div>
    );
}

export default observer(AgendaItemEditView);
