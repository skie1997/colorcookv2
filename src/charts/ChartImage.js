import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import Portal from './Portal';

const ChartImage = (props) => {
    const [image] = useImage(props.src);
    // console.log('props.visSource',props.visSource)
    //                 return <Portal>
    //                     <div style={{ position: 'absolute',
    //           top: 300,
    //           left: 500,}}
    //     width={props.width} height={props.height} >
    //                           <svg style={{zIndex: 999999}} width="100" height="100" viewBox="0 0 100 100" dangerouslySetInnerHTML={{__html: props.visSource}}>
    //                             </svg>
    //                             </div>
    //                     </Portal>
    return <Image ref={node=>props.getImageRef(node)} name={props.name} image={image} width={props.width} height={props.height} />;
};

export default ChartImage;