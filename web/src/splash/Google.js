import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const Google = (props) => {
    let navigate = useNavigate();

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
    }, [])

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <h1>{props.header}!</h1>
        </div>
    )
}


export default Google;