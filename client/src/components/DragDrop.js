import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as tf from '@tensorflow/tfjs';
import { taggerURL } from '../api';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const Image = (props) => {
    useEffect(async () => {
        const model = await tf.loadLayersModel(taggerURL);
        const imgElem = document.getElementById('uploadImg' + props.index);
        const img = await tf.browser.fromPixels(imgElem);
        const resizedImg = await tf.image.resizeBilinear(img, [255, 255]);
        const expanded_img = resizedImg.expandDims(0);
        const predicted = model.predict(expanded_img, 0);

        const predicted_class = ['abstract_art', 'architectural_art', 'characterdesign_art', 'concept_art', 'environmental_art', 'mature_art', 'traditional_art'];
        const predictedArray = Array.from(predicted.dataSync());

        var p_ind = [];
        var final = [];

        for (var i = 0; i < predictedArray.length; i++) {
            p_ind.push(i); // add index to output array
            if (p_ind.length > 2) {
                p_ind.sort(function (a, b) {
                    return predictedArray[b] - predictedArray[a];
                }); // descending sort the output array
                p_ind.pop(); // remove the last index (index of smallest element in output array)
            }
        }
        for (var i = 0; i < p_ind.length; i++) {
            final.push(predicted_class[p_ind[i]]);
        }
        props.setCategories(final);
    }, [props.image.id])

    return (
        <Draggable draggableId={props.image.id} index={props.index}>
            {provided => (
                <div
                    className={`relative h-60 w-1/3 rounded ${props.index === 0 ? 'border-dashed border-2 border-indigo-400' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <img id={'uploadImg' + props.index} loading='lazy' src={URL.createObjectURL(props.image.content)} className='w-full h-full object-cover rounded' />
                    {props.index === 0 ? <span className="absolute font-josefinlight text-white pt-0.5 px-2 rounded-tr-md bottom-0 left-0 bg-indigo-400">Primary</span> : ''}
                </div>
            )
            }
        </Draggable >
    );
}

const ImageList = (props) => {
    return props.images.map((image, index) => (
        <Image image={image} index={index} key={image.id} setCategories={props.setCategories} />
    ));
}

const DragDrop = (props) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages(props.selectedImages);
    }, [props.selectedImages])

    const onDragEnd = (result) => {
        if (!result.destination)
            return;

        if (result.destination.index === result.source.index)
            return;

        const newList = reorder(images, result.source.index, result.destination.index);
        setImages(newList);
        props.setReorderedFiles(newList.map(item => { return item.content }))
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {provided => (
                    <div
                        ref={provided.innerRef}
                        className='scrollbar flex p-2 overflow-auto space-x-2'
                        {...provided.droppableProps}>
                        <ImageList images={images} setCategories={props.setCategories} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default DragDrop;