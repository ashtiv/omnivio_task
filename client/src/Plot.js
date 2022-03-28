import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useStateValue } from './StateProvider';
import { useNavigate } from 'react-router-dom';

function Plot() {
    const navigate = useNavigate();
    const [{ axiosurl, editid }, dispatch] = useStateValue();
    const [plot, setplot] = useState('');
    const [movie, setmovie] = useState({});
    useEffect(() => {
        async function asyncCall() {
            const res = await axios.get(axiosurl + '/p/' + editid)
            var cc = res.data
            setmovie(cc);
            setplot(cc?.description);
            // console.log(cc?.description)
        }
        asyncCall();
    }, []);
    function editplot(e) {
        e.preventDefault();
        async function asyncCall() {
            // console.log(axiosurl + '/p', ' aaxxios')
            const res = await axios.post(axiosurl + '/p', {
                "editid": editid,
                "plot": plot
            })
            alert("Plot for movie " + movie?.title + " changed")
            dispatch({
                type: 'SET_ID',
                id: null
            })
            navigate("/")
        }
        asyncCall();
    }
    return (
        <div>
            <form onSubmit={e => editplot(e)} className='container my-5 border p-5 w-50 d-flex align-items-center flex-column'>
                <div class="mb-3 d-flex align-items-center flex-column w-100">
                    <img src={movie?.image} class="img-fluid w-25 list-group-item align-self-center bg-light w-25 d-flex align-items-center flex-column my-5" alt="Responsive image" />
                    <label class="form-label">Edit Movie Plot</label>
                    <textarea className='p-3 container' value={plot} onChange={e => setplot(e.target.value)} rows='5' cols='70'></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Change</button>
            </form>

        </div>
    )
}

export default Plot