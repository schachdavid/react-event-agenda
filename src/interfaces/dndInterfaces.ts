/**
 * Interfaces for Drag and Drop Objects.
 *
 * @file Interfaces for Drag and Drop Objects. Define new Kind of DnD Objects here.
 * 
 * @license MIT
 */

export interface DragObject {
    clickedItemId: string,
    itemIds: Array<string>,
    type: string
  }
  