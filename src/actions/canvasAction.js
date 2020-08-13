import ActionType from './types';
import { generateChannels, isLoading } from '../selectors/canvas';

export const addChart = (widgets) => ({
    type: ActionType.ADD_CHART,
    widgets
})

export const removeChart = (widgets) => ({
    type: ActionType.REMOVE_CHART,
    widgets

})
export const selectChart = (index) => ({
    type: ActionType.SELECT_CHART,
    index
})
export const changeMapping = (widgets) => ({
    type: ActionType.CHANGE_MAPPING,
    widgets
})
export const changeColormap = (colormap) => ({
    type: ActionType.CHANGE_COLORMAP,
    colormap
})
export const changeLayout = (layout) => ({
    type: ActionType.CHANGE_LAYOUT,
    layout
})
export const changeColorStyle = (color, cardcolor, textcolor, shadowcolor) => ({
    type: ActionType.CHANGE_COLORSTYLE,
    color,
    cardcolor,
    textcolor,
    shadowcolor
})
export const changeCurrentColorset = (currentColorset) => ({
    type: ActionType.CHANGE_CURRENTCOLORSET,
    currentColorset
})
export const changeGlobalColorpair = (globalColorpair) => ({
    type: ActionType.CHANGE_GLOBALCOLORAIR,
    globalColorpair
})

export const displayBookmarks = (displayFlag) =>({
    type: ActionType.DISPLAY_BOOKMARKS,
    displayFlag
})

export const changeChartMode = (chartMode) => ({
    type: ActionType.CHANGE_CHARTMODE,
    chartMode
})

export const changeGenerateChannels = (generateChannels) =>({
    type: ActionType.CHANGE_GENERATECHANNELS,
    generateChannels
})

export const changeGenerateSpec = (generateSpec) =>({
    type: ActionType.CHANGE_GENERATESPEC,
    generateSpec
})

export const changeEditMode = (editMode) => ({
    type: ActionType.CHANGE_EDITMODE,
    editMode
})

export const changeEditChannels = (editChannels) =>({
    type: ActionType.CHANGE_EDITCHANNELS,
    editChannels
})

export const changeEditSpec = (editSpec) =>({
    type: ActionType.CHANGE_EDITSPEC,
    editSpec
})

export const changeLoading = (isLoading) =>({
    type: ActionType.CHANGE_LOADING,
    isLoading

})

export const selectElement = (elementIndex, elementName) => ({
    type: ActionType.SELECT_ELEMENT,
    elementIndex,
    elementName,
})

export const unselectElement = () => ({
    type: ActionType.UNSELECT_ELEMENT,
})

export const cleanInterationLayer =(isCleanInterationLayer)=>({
    type:ActionType.CLEAN_INTERACTION_LAYER,
    isCleanInterationLayer
})

export const addElement = (element) => ({
    type: ActionType.ADD_ELEMENT,
    element,
})

export const updateElement = (element, elementIndex, elementName, updateInfo) => ({
    type: ActionType.UPDATE_ELEMENT,
    element,
    elementIndex,
    elementName,
    updateInfo,
})

export const removeElement = (element, elementIndex) => ({
    type: ActionType.REMOVE_ELEMENT,
    element,
    elementIndex,
})

export const reorderElement = (sourceIndex, destinationIndex) => ({
    type: ActionType.REORDER_ELEMENT,
    sourceIndex,
    destinationIndex,
})


export const dragElement = (dragPos) => ({ 
    type: ActionType.DRAG_ELEMENT,
    dragPos,
})

export const transformElement = (transformInfo) => ({ 
    type: ActionType.TRANSFORM_ELEMENT,
    transformInfo,
})