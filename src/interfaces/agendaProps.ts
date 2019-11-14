import {IItem} from './../models/ItemModel'

export interface ICustomItemAction {
    iconName: string,
    action: (item: IItem) => {}
}