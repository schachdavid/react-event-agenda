/**
 * Additional Interfaces for react-event-agenda top level props.
 * 
 * @license MIT
 */

import { IItem } from './../models/ItemModel'

export interface ICustomItemAction {
    iconName: string,
    iconToRender?: JSX.Element,
    action: (item: IItem) => void
}

