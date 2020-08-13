import { connect } from 'react-redux';
import ResourcePane from './ResourcePane';
import {currentScene, sceneIndex,scenes} from '@/selectors/video';
import {isCleanInterationLayer} from '@/selectors/canvas';
import * as videoActions from '@/actions/videoAction';
import * as canvasActions from '@/actions/canvasAction';
import * as uiActions from '@/actions/uiAction';
import * as visActions from '@/actions/visAction';
import {uimode, showResourcePane} from '@/selectors/ui';
import {currentElement, elementIndex, isElementSelected, dragPos,transformInfo} from '@/selectors/canvas';
import { dataIndex, dataNameList, dataList, fieldsList, displaySpec, currentData, currentVis, channels, choosenAnimation, selectedAnimation, selectedAnimationIndex, isSelectingChartElement, selectingParameter, chartAnimationVideoURL, globalColorStyle } from '@/selectors/vis';
import { widgets, selectChartIndex, colormap,backgroundColor,currentColorset, globalColorpair,chartMode, generateChannels, generateSpec, editMode, editChannels, editSpec, isLoading} from '../../selectors/canvas';
import { dispatch } from 'd3';
// import { dataIndex } from '../../selectors/vis';

const mapStateToProps = state => {
    return {
        //layout-grid
        widgets: widgets(state),
        selectChartIndex: selectChartIndex(state),
        colormap: colormap(state),
        backgroundColor: backgroundColor(state),
        currentColorset: currentColorset(state),
        globalColorpair: globalColorpair(state),
        
        chartMode: chartMode(state),
        generateChannels: generateChannels(state),
        generateSpec: generateSpec(state),
        editMode: editMode(state),
        editChannels: editChannels(state),
        editSpec: editSpec(state),

        isLoading: isLoading(state),


        scenes:scenes(state),
        sceneIndex: sceneIndex(state),
        currentScene: currentScene(state),
        elementIndex: elementIndex(state),
        currentElement: currentElement(state),
        isElementSelected: isElementSelected(state),
        uimode: uimode(state),
        showResourcePane: showResourcePane(state),
        isCleanInterationLayer: isCleanInterationLayer(state),
        // data
        dataIndex: dataIndex(state),
        dataNameList: dataNameList(state),
        dataList: dataList(state),
        fieldsList: fieldsList(state),
        currentData: currentData(state),
        // vis
        displaySpec: displaySpec(state),
        currentVis: currentVis(state),
        channels: channels(state),
        choosenAnimation: choosenAnimation(state),
        selectedAnimation: selectedAnimation(state),
        selectedAnimationIndex: selectedAnimationIndex(state),
        isSelectingChartElement: isSelectingChartElement(state),
        selectingParameter: selectingParameter(state),
        globalColorStyle: globalColorStyle(state),

    }
}

const mapDispatchToProps = dispatch => {
    return {
        //layout-grid
        addChart: (widgets) => dispatch(canvasActions.addChart(widgets)),
        removeChart: (widgets) => dispatch(canvasActions.removeChart(widgets)),
        selectChart: (index) => dispatch(canvasActions.selectChart(index)),
        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets)),
        changeColormap: (colormap) => dispatch(canvasActions.changeColormap(colormap)),
        changeGlobalColorpair: (globalColorpair) => dispatch(canvasActions.changeGlobalColorpair(globalColorpair)),
        // changeChartMode: (chartMode) => dispatch(canvasActions.changeChartMode(chartMode)),
        // changeGenerateChannels: (generateChannels) => dispatch(canvasActions.changeGenerateChannels(generateChannels)),

        changeChartMode: (chartMode) => dispatch(canvasActions.changeChartMode(chartMode)),
        changeGenerateChannels: (generateChannels) => dispatch(canvasActions.changeGenerateChannels(generateChannels)),
        changeGenerateSpec: (generateSpec) => dispatch(canvasActions.changeGenerateSpec(generateSpec)),

        changeEditMode: (editMode) => dispatch(canvasActions.changeEditMode(editMode)),
        changeEditChannels: (editChannels) => dispatch(canvasActions.changeEditChannels(editChannels)),
        changeEditSpec: (editSpec) => dispatch(canvasActions.changeEditSpec(editSpec)),

        changeLoading: (isLoading) => dispatch(canvasActions.changeLoading(isLoading)),

        selectElement: (elementIndex, elementName) => dispatch(canvasActions.selectElement(elementIndex, elementName)),
        unselectElement: () => dispatch(canvasActions.unselectElement()),
        cleanInterationLayer: (isClean) => dispatch(canvasActions.cleanInterationLayer(isClean)),
        addElement: (element) => dispatch(canvasActions.addElement(element)),
        removeElement: (elementIndex) => dispatch(canvasActions.removeElement(elementIndex)),
        updateElement: (element, elementIndex, selectElement) => dispatch(canvasActions.updateElement(element, elementIndex, selectElement)),
        addScene: (scene) => dispatch(videoActions.addScene(scene)),
        updateScene: (index, scene) => dispatch(videoActions.updateScene(index, scene)),
        updateBackgroundMusic :(element,elementName)=>dispatch(videoActions.addBackgroundMusic(element,elementName)),
        displayTrackEditor: () => dispatch(uiActions.displayTrackEditor()),
        displayResourceTargetArea: (isActive) => dispatch(uiActions.displayResourceTargetArea(isActive)),
        displayResourcePane: (isActive) => dispatch(uiActions.displayResourcePane(isActive)),
        displayMusicTargetArea: (isActive) => dispatch(uiActions.displayMusicTargetArea(isActive)),
        cleanInterationLayer: (isClean) => dispatch(canvasActions.cleanInterationLayer(isClean)),
        
         // vis
         openEditor: (dataIndex, spec) => dispatch(visActions.openEditor(dataIndex, spec)),
         switchData : (index) => dispatch(visActions.switchData(index)),
         addData: (dataName, data, dataSchema) => dispatch(visActions.addData(dataName, data, dataSchema)),
         updateData: (index, data, dataSchema) => dispatch(visActions.updateData(index, data, dataSchema)),
         deleteData: (index) => dispatch(visActions.deleteData(index)),
         encoding: (channel, field, isEncoded) => {
             if (isEncoded) {
                 return dispatch(visActions.modifyEncoding(channel, fieldsList))
             } else {
                 return dispatch(visActions.encoding(channel, field))
             }
         },
         removeEncoding: (channel, field) => dispatch(visActions.removeEncoding(channel, field)),
         changeAggregation: (channel, method) => dispatch(visActions.changeAggregation(channel, method)),
         configureStyle: (style) => dispatch(visActions.configureStyle(style)),
         chooseChartAnimation: (animation) => dispatch(visActions.chooseChartAnimation(animation)),
         selectChartAnimation: (animation, index) => dispatch(visActions.selectChartAnimation(animation, index)),
         selectChartElement: (isSelecting, parameter) => dispatch(visActions.selectChartElement(isSelecting, parameter)),
         addChartAnimation: (animation) => dispatch(visActions.addChartAnimation(animation)),
         modifyChartAnimation: (index, animation) => dispatch(visActions.modifyChartAnimation(index, animation)),
         removeChartAnimation: (index) => dispatch(visActions.removeChartAnimation(index)),
         reorderChartAnimation: (animations) => dispatch(visActions.reorderChartAnimation(animations)),
         updatChartInnerAnimationUrl: (url) => dispatch(visActions.updatChartInnerAnimationUrl(url))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ResourcePane)