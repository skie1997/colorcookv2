import ActionType from '../actions/types';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';

const initialState = {
    isElementSelected: false,
    isCleanInterationLayer: false,
    elementIndex: -1,
    elementName: '',
    actionHistory: [],
    dragPos:'', // for tool display
    transformInfo:'', // for tool display
    widgets: [],//for layout-grid
    selectChartIndex: -1,
    layout:'',
    backgroundColor: '#fff',
    cardColor: '#fff',
    textColor: 'rgb(32,32,32)',
    shadowColor: 'rgb(250,250,250)',
    colormap: [],
    currentColorset: ["rgb(197,185,184)", "rgb(229,77,114)", "rgb(106,149,173)", "rgb(246,180,73)", "rgb(209,155,176)", "rgb(161,98,101)", "rgb(243,174,117)"],
    globalColorpair: [],
    displayFlag: false,

    chartMode: 'bar chart',
    generateChannels: d3Channels('bar chart'),
    generateSpec: d3DefaultSpec('bar chart'),

    editMode: false,
    editChannels: '',
    editSpec: '',    

    isLoading: false,
}

export default (state = initialState, action) => {
    // const newState = Object.assign({},state);
    const newState = {...state};
    newState.actionHistory = state.actionHistory.slice();
    newState.actionHistory.push(action);
    switch (action.type) {
        //layout-grid action
        case ActionType.ADD_CHART:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        case ActionType.REMOVE_CHART:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        case ActionType.SELECT_CHART:
            newState.selectChartIndex = action.index; 
            return newState;
        case ActionType.CHANGE_LAYOUT:
            newState.layout = action.layout; 
            return newState;
        
        case ActionType.CHANGE_MAPPING:
            newState.widgets = action.widgets;
            // newState.colormap = action.colormap;
            return newState;
        
        case ActionType.CHANGE_COLORMAP:
            newState.colormap = action.colormap;
            return newState;
        
        case ActionType.CHANGE_CURRENTCOLORSET:
            newState.currentColorset = action.currentColorset;
            return newState;
        
        case ActionType.CHANGE_GLOBALCOLORAIR:
            newState.globalColorpair = action.globalColorpair;
            return newState;

        case ActionType.CHANGE_CHARTMODE:
            newState.chartMode = action.chartMode;
            console.log('change-chartmode',action.chartMode)
            return newState;
        case ActionType.CHANGE_GENERATECHANNELS:
            newState.generateChannels = action.generateChannels;
            return newState;

        case ActionType.CHANGE_GENERATESPEC:
            newState.generateSpec = action.generateSpec;
            return newState;

        case ActionType.CHANGE_EDITMODE:
            newState.editMode = action.editMode;
            return newState;
        case ActionType.CHANGE_EDITCHANNELS:
            newState.editChannels = action.editChannels;
            return newState;

        case ActionType.CHANGE_EDITSPEC:
            newState.editSpec = action.editSpec;
            return newState;

        case ActionType.CHANGE_LOADING:
            newState.isLoading = action.isLoading;
            return newState;
        
        
        case ActionType.DISPLAY_BOOKMARKS:
            newState.displayFlag = action.displayFlag;
            return newState;

        case ActionType.CHANGE_COLORSTYLE:
            newState.backgroundColor = action.color;
            newState.cardColor = action.cardcolor;
            newState.textColor = action.textcolor;
            newState.shadowColor = action.shadowcolor;
            return newState;
        

        case ActionType.SELECT_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState;
        case ActionType.DRAG_ELEMENT:
            newState.dragPos = action.dragPos;
            return newState;
        case ActionType.TRANSFORM_ELEMENT:
            newState.transformInfo = action.transformInfo;
            return newState;
        case ActionType.UNSELECT_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.CLEAN_INTERACTION_LAYER: 
            newState.isCleanInterationLayer = action.isCleanInterationLayer;
            return newState;
        case ActionType.ADD_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState;
        case ActionType.REMOVE_ELEMENT:
            newState.isElementSelected = false;
            newState.elementIndex = -1;
            newState.elementName = '';
            return newState
        case ActionType.UPDATE_ELEMENT:
            //TODO: add action detail
            newState.isElementSelected = true;
            newState.elementIndex = action.elementIndex;
            newState.elementName = action.elementName;
            return newState
        case ActionType.REORDER_ELEMENT:
            newState.isElementSelected = true;
            newState.elementIndex = action.destinationIndex;
            return newState
        case ActionType.UNDO_CANVAS:
            //TODO: undo
            return state
        case ActionType.REDO_CANVAS:
            //TODO: redo
            return state
        default:
            return state
    }
}