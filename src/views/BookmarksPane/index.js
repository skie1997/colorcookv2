import { connect } from 'react-redux';
import BookmarksPane from './BookmarksPane';
import {scenes, sceneIndex} from '@/selectors/video';
import {uimode} from '@/selectors/ui';
import { dataList } from '@/selectors/vis';
import * as videoActions from '@/actions/videoAction';
import * as uiActions from '@/actions/uiAction';
import * as canvasActions from '@/actions/canvasAction';
import { displayFlag } from '../../selectors/canvas';

const mapStateToProps = state => {
    return {
        scenes: scenes(state),
        sceneIndex: sceneIndex(state),
        uimode: uimode(state),
        // vis
        dataList: dataList(state),

        //canvas
        displayFlag: displayFlag(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //canvas
        displayBookmarks: (displayFlag) => dispatch(canvasActions.displayBookmarks(displayFlag)),

        unselectElement: () => dispatch(canvasActions.unselectElement()),
        selectScene: (index) => dispatch(videoActions.selectScene(index)),
        addScene: (scene) => dispatch(videoActions.addScene(scene)),
        removeScene: (index) => dispatch(videoActions.removeScene(index)),
        updateScene: (index, scene) => dispatch(videoActions.updateScene(index, scene)),
        reorderScene: (sourceIndex, destinationIndex) => dispatch(videoActions.reorderScene(sourceIndex, destinationIndex)),
        addProject: (source) => dispatch(videoActions.addProject(source)),
        removeProject: () => dispatch(videoActions.removeProject()),
        displayTrackEditor: () => dispatch(uiActions.displayTrackEditor()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BookmarksPane)