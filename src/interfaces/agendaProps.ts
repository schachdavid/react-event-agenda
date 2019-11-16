import { IItem } from './../models/ItemModel'

export interface ICustomItemAction {
    iconName: string,
    iconToRender?: JSX.Element,
    action: (item: IItem) => {}
}

