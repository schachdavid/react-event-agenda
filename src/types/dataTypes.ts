
export interface ListItemData {
    text: string,
    id: string,
}

export interface ListItemUi {
    ui?: {
        hidden?: boolean,
        selected?: boolean,
    }
}

export interface ListItem extends ListItemData, ListItemUi {

}

export default ListItem;