import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as tf from '@tensorflow/tfjs';
import { api_taggerURL } from '../utils/api_routes';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const Image = ({ image, index, r_setSnackMessage, setCategories, isFlagged, setIsFlagged }) => {
    useEffect(() => {
        r_setSnackMessage({
            open: true,
            message: 'Please wait a moment as the system processes your upload and assigns a category.',
            type: 'tagger_start'
        });

        model_load()
            .then(() => {
                r_setSnackMessage({
                    open: true,
                    message: 'Categories for your upload were successfully added!',
                    type: 'tagger_stop'
                });
            })
            .catch(err => {
                console.log(err);

                r_setSnackMessage({
                    open: false,
                    message: '',
                    type: ''
                });
            });
    }, [image.id])

    const model_load = async () => {
        const model = await tf.loadLayersModel(api_taggerURL);
        const imgElem = document.getElementById('uploadImg' + index);
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
        if (final.includes("mature_art")) {
            setIsFlagged(true);
            throw new Error("Flagged content");
        }
        setCategories(final);
    }

    return (
        <Draggable draggableId={image.id} index={index}>
            {provided => (
                <div
                    className={`relative h-60 w-1/3 rounded ${index === 0 ? 'border-dashed border-2 border-indigo-400' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <img id={'uploadImg' + index} loading='lazy' src={URL.createObjectURL(image.content)} className='w-full h-full object-cover rounded' />
                    {index === 0 ? <span className="absolute  text-white pt-0.5 px-2 rounded-tr-md bottom-0 left-0 bg-indigo-400">Primary</span> : ''}
                </div>
            )
            }
        </Draggable >
    );
}

const ImageList = ({ images, setCategories, r_setSnackMessage, isFlagged, setIsFlagged }) => {
    return images.map((image, index) => (
        <Image image={image} index={index} key={image.id} setCategories={setCategories} r_setSnackMessage={r_setSnackMessage} isFlagged={isFlagged} setIsFlagged={setIsFlagged} />
    ));
}

const DragDrop = ({ isFlagged, setIsFlagged, selectedImages, setReorderedFiles, setCategories, r_setSnackMessage }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages(selectedImages);
    }, [selectedImages])

    const onDragEnd = (result) => {
        if (!result.destination)
            return;

        if (result.destination.index === result.source.index)
            return;

        const newList = reorder(images, result.source.index, result.destination.index);
        setImages(newList);
        setReorderedFiles(newList.map(item => { return item.content }))
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {provided => (
                    <div
                        ref={provided.innerRef}
                        className='scrollbar flex p-2 overflow-auto gap-2'
                        {...provided.droppableProps}>
                        <ImageList images={images} setCategories={setCategories} r_setSnackMessage={r_setSnackMessage} isFlagged={isFlagged} setIsFlagged={setIsFlagged} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default DragDrop;