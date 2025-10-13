import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { r_signIn } from '../store/reducers/users.reducer';

const Google = (props) => {
    let navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (params.token) {
            const userData = jwt_decode(params.token);
            Cookies.set('hasSession', 'true', { expires: 7 }); // readable cookie
            localStorage.setItem('hasSession', 'true');
            dispatch(r_signIn({ accessToken: params.token, user: userData }));
            navigate('/')
        }
    }, [])

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <h1>{props.header}!</h1>
        </div>
    )
}


export default Google;