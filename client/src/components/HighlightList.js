import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { HorizontalCard } from './Card';

const HighlightList = (props) => {
    let navigate = useNavigate();

    return (
        <div className='flex flex-col w-full'>
            <h2 className='font-josefinlight font-bold text-3xl text-violet-500'>{props.title}</h2>
            <div className='h-1 bg-violet-500 w-10 mb-2 rounded'></div>
            <div className='flex flex-col space-y-2'>
                {props.list.map((explore, index) => (
                    <HorizontalCard key={index} explore={explore} author={explore.author} />
                ))}
            </div>
            <button onClick={() => navigate(`/explore?filter=${props.type}`)} className='text-end mt-1 underline font-josefinlight font-bold text-lg text-violet-500'>View more</button>
        </div>
    )
}

export default HighlightList;