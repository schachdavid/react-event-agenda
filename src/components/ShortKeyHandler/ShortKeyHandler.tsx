import React, { useEffect } from 'react';
import { useViewModelContext } from '../../hooks/ViewModelContext';

interface IProps {

}

const ShortKeyHandler: React.FC<IProps> = ({ }: IProps) => {

    const viewModel = useViewModelContext();

    useEffect(() => {
        const checkUndoRedoPress = (ev: KeyboardEvent) => {            
            var keyCode = ev.keyCode;
            if (ev.metaKey === true || ev.ctrlKey === true) {
                if (keyCode === 89) {
                    viewModel.redo()
                    ev.preventDefault();
                }
                else if (keyCode === 90) {
                    //special case (CTRL-SHIFT-Z) does a redo (on a mac for example)
                    if (ev.shiftKey === true) {
                        viewModel.redo();
                    }
                    else {
                        viewModel.undo();
                    }
                    ev.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', checkUndoRedoPress);
        return () => window.removeEventListener('keydown', checkUndoRedoPress);
    }, [])

    return <></>
};

export default ShortKeyHandler;
