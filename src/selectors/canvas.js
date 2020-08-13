import { createSelector } from 'reselect';
import { getChannels } from '@/charts/Info';

export const isElementSelected = state => state.canvas.isElementSelected;
export const isCleanInterationLayer = state => state.canvas.isCleanInterationLayer;
export const elementIndex = state => state.canvas.elementIndex;
export const elementName = state => state.canvas.elementName;
export const actionHistory = state => state.canvas.actionHistory;
export const dragPos = state => state.canvas.dragPos;
export const transformInfo = state => state.canvas.transformInfo;

//layout-grid widgets
export const widgets = state => state.canvas.widgets;
export const colormap = state => state.canvas.colormap;
export const globalColorpair = state => state.canvas.globalColorpair;
export const selectChartIndex = state => state.canvas.selectChartIndex;
export const layout = state => state.canvas.layout;
export const backgroundColor = state => state.canvas.backgroundColor;
export const cardColor = state => state.canvas.cardColor;
export const textColor = state => state.canvas.textColor;
export const shadowColor = state => state.canvas.shadowColor;
export const currentColorset = state => state.canvas.currentColorset;
export const displayFlag = state => state.canvas.displayFlag;

//data-panel
export const chartMode = state => state.canvas.chartMode;
export const generateChannels = state => state.canvas.generateChannels;
export const generateSpec = state => state.canvas.generateSpec;

export const editMode = state => state.canvas.editMode;
export const editChannels = state => state.canvas.editChannels;
export const editSpec = state => state.canvas.editSpec;

export const isLoading = state => state.canvas.isLoading;

// export const generateChannels = state => state.canvas.generateChannels;

// export const generateChannels = createSelector(
//     chartMode,
//     function(chartMode) {
//         if(chartMode){
//             let generateChannels = getChannels('D3', charttype)
//             for (const key in generateChannels) {
//                 generateChannels[key].isEncoded = false;
//                 generateChannels[key].field = '';
//             }
//             return generateChannels;
//         }else{
//             return '';
//         }
        
//     }
// )

export const globalFieldsList = createSelector(
    globalColorpair,
    function(globalColorpair) {
        let fieldsList = []
        globalColorpair.forEach((item, index) =>{
            fieldsList.push(Object.keys(item)[0])
        })
        return fieldsList;
    }
)

export const globalColorList = createSelector(
    globalColorpair,
    function(globalColorpair) {
        let colorList = []
        globalColorpair.forEach((item, index) =>{
            colorList.push(Object.values(item)[0])
        })
        return colorList;
    }
)

const scenes = state => state.video.scenes;
const sceneIndex = state => state.video.index;

export const currentElements = createSelector(
    scenes,
    sceneIndex,
    function(scenes, sceneIndex) {
        return scenes[sceneIndex].elements();
    }
)

export const currentElement = createSelector(
    currentElements,
    elementIndex,
    function(currentElements, elementIndex) {
        return currentElements[elementIndex];
    }
)