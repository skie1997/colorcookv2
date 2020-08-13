import { connect } from 'react-redux';
import CanvasPane from './CanvasPane';
import {currentScene, sceneIndex, scenes, isFirstScene, isLastScene, past, future, backgroundMusicName} from '@/selectors/video';
import {currentElement, currentElements, elementIndex, elementName, isElementSelected, dragPos, transformInfo, isCleanInterationLayer} from '@/selectors/canvas';
import { scenePosition } from '@/selectors/scene';
import { isPerforming, isScenePerforming, isVideoPerforming } from '@/selectors/player';
import { showAnimationTargetArea, showResourceTargetArea,showMusicTargetArea,uimode, showResourcePane, showToolPane, showPathLayer } from '@/selectors/ui';
import { dataNameList, dataList, fieldsList, displaySpec, currentData, currentVis, channels } from '@/selectors/vis';
import * as uiActions from '@/actions/uiAction';
import * as videoActions from '@/actions/videoAction';
import * as canvasActions from '@/actions/canvasAction';
import * as playerActions from '@/actions/playerAction';
import * as sceneActions from '@/actions/sceneAction';
import * as visActions from '@/actions/visAction';
import { widgets, layout, backgroundColor, cardColor, textColor, currentColorset, colormap,globalColorpair,globalFieldsList, globalColorList, chartMode, generateChannels, generateSpec, editMode, editChannels, editSpec, shadowColor } from '../../selectors/canvas';
import { startCase } from 'lodash';
// import * as metaActions from '@/actions/metaAction';

const mapStateToProps = state => {
    return {
        //layout-grid
        widgets: widgets(state),
        layout:layout(state),
        backgroundColor: backgroundColor(state),
        cardColor: cardColor(state),
        textColor: textColor(state),
        shadowColor: shadowColor(state),
        colormap: colormap(state),    
        currentColorset: currentColorset(state),
        globalColorpair: globalColorpair(state),
        globalFieldsList: globalFieldsList(state),
        globalColorList: globalColorList(state),

        chartMode: chartMode(state),
        generateChannels: generateChannels(state),
        generateSpec: generateSpec(state),
        editMode: editMode(state),
        editChannels: editChannels(state),
        editSpec: editSpec(state),



        
        scenes: scenes(state),
        sceneIndex: sceneIndex(state),
        isFirstScene: isFirstScene(state),
        isLastScene: isLastScene(state),
        currentScene: currentScene(state),
        past: past(state),
        future: future(state),
        backgroundMusicName: backgroundMusicName(state),
        elementIndex: elementIndex(state),
        elementName: elementName(state),
        currentElement: currentElement(state),
        currentElements: currentElements(state),
        isElementSelected: isElementSelected(state),
        isCleanInterationLayer: isCleanInterationLayer(state),
        isPerforming: isPerforming(state),
        isScenePerforming: isScenePerforming(state),
        isVideoPerforming: isVideoPerforming(state),
        scenePosition: scenePosition(state),
        showAnimationTargetArea: showAnimationTargetArea(state),
        showPathLayer:showPathLayer(state),
        showResourceTargetArea: showResourceTargetArea(state),
        showMusicTargetArea: showMusicTargetArea(state),
        // canvas
        dragPos:dragPos(state),
        transformInfo:transformInfo(state),
        // data
        dataNameList: dataNameList(state),
        dataList: dataList(state),
        fieldsList: fieldsList(state),
        currentData: currentData(state),
        // vis
        displaySpec: displaySpec(state),
        currentVis: currentVis(state),
        channels: channels(state),
        // showpane
        uimode: uimode(state),
        showResourcePane: showResourcePane(state),
        showToolPane: showToolPane(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //layout-grid
        removeChart: (widgets) => dispatch(canvasActions.removeChart(widgets)),
        selectChart: (index) => dispatch(canvasActions.selectChart(index)),
        openEditor: (dataIndex, spec) => dispatch(visActions.openEditor(dataIndex, spec)),
        changeMapping: (widgets) => dispatch(canvasActions.changeMapping(widgets)),
        addChart: (widgets) => dispatch(canvasActions.addChart(widgets)),
        changeLayout: (layout) => dispatch(canvasActions.changeLayout(layout)),
        changeColormap: (colormap) => dispatch(canvasActions.changeColormap(colormap)),
        changeGlobalColorpair: (globalColorpair) => dispatch(canvasActions.changeGlobalColorpair(globalColorpair)),

        changeChartMode: (chartMode) => dispatch(canvasActions.changeChartMode(chartMode)),
        changeGenerateChannels: (generateChannels) => dispatch(canvasActions.changeGenerateChannels(generateChannels)),
        changeGenerateSpec: (generateSpec) => dispatch(canvasActions.changeGenerateSpec(generateSpec)),

        changeEditMode: (editMode) => dispatch(canvasActions.changeEditMode(editMode)),
        changeEditChannels: (editChannels) => dispatch(canvasActions.changeEditChannels(editChannels)),
        changeEditSpec: (editSpec) => dispatch(canvasActions.changeEditSpec(editSpec)),

        changeLoading: (isLoading) => dispatch(canvasActions.changeLoading(isLoading)),
        

        //vis
        switchData : (index) => dispatch(visActions.switchData(index)),

        displayTrackEditor: () => dispatch(uiActions.displayTrackEditor()),
        selectScene: (index) => dispatch(videoActions.selectScene(index)),
        updateScene: (index, scene) => dispatch(videoActions.updateScene(index, scene)),
        selectElement: (elementIndex, elementName) => dispatch(canvasActions.selectElement(elementIndex, elementName)),
        unselectElement: () => dispatch(canvasActions.unselectElement()),
        cleanInterationLayer: (isClean) => dispatch(canvasActions.cleanInterationLayer(isClean)),
        addElement: (element) => dispatch(canvasActions.addElement(element)),
        removeElement: (elementIndex) => dispatch(canvasActions.selectElement(elementIndex)),
        updateElement: (element, elementIndex, elementName) => dispatch(canvasActions.updateElement(element, elementIndex, elementName)),
        playVideo: () => dispatch(playerActions.playVideo()),
        stopVideo: () => dispatch(playerActions.stopVideo()),
        setPosition: (position) => dispatch(sceneActions.setPosition(position)),
        updateBackgroundMusic :(element,elementName)=>dispatch(videoActions.addBackgroundMusic(element,elementName)),
        // undoCanvas: (index) => dispatch(metaActions.undoCanvas(index)),
        // redoCanvas: (index) => dispatch(metaActions.redoCanvas(index)),
        dragElement: (dragPos) => dispatch(canvasActions.dragElement(dragPos)),
        transformElement: (transformInfo) => dispatch(canvasActions.transformElement(transformInfo)),
        // showpane
        displayResourcePane: (isActive) => dispatch(uiActions.displayResourcePane(isActive)),
        displayToolPane: (isActive) => dispatch(uiActions.displayToolPane(isActive)),
        //showpath
        displayPathLayer:(isActive) => dispatch(uiActions.displayPathLayer(isActive)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CanvasPane)