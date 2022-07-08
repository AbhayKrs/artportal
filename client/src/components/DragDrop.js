import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const Image = (props) => {
    return (
        <Draggable draggableId={props.image.id} index={props.index}>
            {provided => (
                <div
                    className={`relative h-60 w-1/3 rounded ${props.index === 0 ? 'border-dashed border-2 border-indigo-400' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <img loading='lazy' src={URL.createObjectURL(props.image.content)} className='w-full h-full object-cover rounded' />
                    {props.index === 0 ? <span className="absolute font-josefinlight text-white pt-0.5 px-2 rounded-tr-md bottom-0 left-0 bg-indigo-400">Primary</span> : ''}
                </div>
            )
            }
        </Draggable >
    );
}

const ImageList = (props) => {
    return props.images.map((image, index) => (
        <Image image={image} index={index} key={image.id} />
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
                        <ImageList images={images} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default DragDrop;