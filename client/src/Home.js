import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useStateValue } from "./StateProvider";
import { useNavigate } from 'react-router-dom';
function Home() {
    const navigate = useNavigate();
    const [title, settitle] = useState('');
    const [searchedmovies, setsearchedmovies] = useState([]);
    const [year, setyear] = useState('0');
    const [sort, setsort] = useState('s');
    const [yeararr, setyeararr] = useState([]);
    const [sortarr, setsortarr] = useState(["Metacritic", "Imdb Rating", "Rotten Tomatoes"]);
    const [{ axiosurl, omniurl, apikey }, dispatch] = useStateValue();
    useEffect(() => {
        async function asyncCall() {
            const res = await axios.get(axiosurl + '/users')
            var cc = []
            res.data.map(doc => cc.push(doc));
            cc.reverse();
            setsearchedmovies(cc);
        }
        asyncCall();
        var nn = [];
        for (var i = 1950; i < 2025; i++) {
            nn.push(i)
        }
        setyeararr(nn);
    }, []);
    const handlesubmit = e => {
        e.preventDefault();
        const fetchdata = async () => {
            setyear('0');
            setsort('s');
            try {
                const resjson = await axios.get(omniurl + title + apikey);
                var json = JSON.stringify(resjson.data);
                var newfoo = JSON.parse(json);
                if (newfoo?.Response == "True") {
                    var ratingarray = newfoo?.Ratings;
                    var rottenrating = parseFloat(0);
                    var imdbrating = parseFloat(0);
                    var metarating = parseFloat(0);
                    for (var i = 0; i < ratingarray.length; i++) {
                        if (ratingarray[i]?.Source == "Rotten Tomatoes") {
                            rottenrating = parseFloat(ratingarray[i]?.Value.slice(0, -1));
                        }
                        else if (ratingarray[i]?.Source == "Internet Movie Database") {
                            imdbrating = parseFloat(ratingarray[i]?.Value.slice(0, -3));
                        }
                        else if (ratingarray[i]?.Source == "Metacritic") {
                            metarating = parseFloat(ratingarray[i]?.Value.slice(0, -4));
                        }
                    }
                    const res3 = await axios.get(axiosurl + '/users')
                    var cc3 = []
                    res3.data.map(doc => cc3.push(doc?.title));
                    var ff = 1;
                    for (var i = 0; i < cc3.length; i++) {
                        // console.log(cc3[i], newfoo?.Title, " ccccnnnn")
                        if (cc3[i] == newfoo?.Title) {
                            ff = 0;
                            break;
                        }
                    }
                    if (resjson.data?.Title != undefined && ff == 1) {
                        // console.log("newfoo", newfoo.Title)
                        const res = await axios.post(axiosurl + '/users', {
                            "title": newfoo?.Title,
                            "description": newfoo?.Plot,
                            "year": newfoo?.Year,
                            "metarating": metarating,
                            "rottenrating": rottenrating,
                            "internetrating": imdbrating,
                            "image": newfoo?.Poster
                        })
                        console.log(res.data);
                        async function asyncCall() {
                            const res = await axios.get(axiosurl + '/users')
                            var cc = []
                            res.data.map(doc => cc.push(doc));
                            cc.reverse();
                            setsearchedmovies(cc);
                        }
                        asyncCall();
                        alert("Movie Added Successfully")
                    }
                    else {
                        async function asyncCall() {
                            const res = await axios.get(axiosurl + '/users')
                            var cc = []
                            res.data.map(doc => cc.push(doc));
                            cc.reverse();
                            setsearchedmovies(cc);
                        }
                        asyncCall();
                        alert("Movie already in database")
                    }

                }
                else {
                    alert("Movie not found")
                }
            } catch (e) {
                console.log("error during send : ", e);
            }
        }
        fetchdata();
    }
    function sortsetting(a) {
        async function asyncCall() {
            var sss = 's';
            if (a == "Rotten Tomatoes") {
                setsort('r');
                sss = 'r';
            }
            else if (a == "Imdb Rating") {
                setsort('i');
                sss = 'i';
            }
            else if (a == "Metacritic") {
                setsort('m');
                sss = 'm';
            }
            // console.log(axiosurl + '/users/' + year + '/' + sss, ' aaaa')
            const res = await axios.get(axiosurl + '/users/' + year + '/' + sss)
            var cc = []
            res.data.map(doc => cc.push(doc));
            setsearchedmovies(cc);
        }
        asyncCall();
    }
    function yearsetting(a) {
        async function asyncCall() {
            setyear(a);
            var yyy = a;
            // console.log(axiosurl + '/users/' + yyy + '/' + sort, ' aaaa')
            const res = await axios.get(axiosurl + '/users/' + yyy + '/' + sort)
            var cc = []
            res.data.map(doc => cc.push(doc));
            setsearchedmovies(cc);
        }
        asyncCall();
    }
    function sorttt() {
        if (sort == 'r') {
            return "Rotten Tomatoes"
        }
        else if (sort == 'i') {
            return "Imdb Rating"
        }
        else if (sort == 'm') {
            return "Metacritic"
        }
    }
    function changeplot(id) {
        console.log(id)
        dispatch({
            type: 'SET_ID',
            id: id
        })
        navigate("/plot")
    }
    function deletemovie(id) {
        async function asyncCall() {
            // console.log(axiosurl + '/users/' + yyy + '/' + sort, ' aaaa')
            const res = await axios.get(axiosurl + '/d/' + id)
        }
        asyncCall();
        alert("Movie deleted")
        async function asyncCall2() {
            const res = await axios.get(axiosurl + '/users')
            var cc = []
            res.data.map(doc => cc.push(doc));
            cc.reverse();
            setsearchedmovies(cc);
        }
        asyncCall2();
    }
    return (
        <div>
            <form onSubmit={e => handlesubmit(e)} className='container my-5 border p-5 w-50 d-flex align-items-center flex-column'>
                <div class="mb-3 d-flex align-items-center flex-column w-100">
                    <label class="form-label">Enter Movie Title</label>
                    <input value={title} class="form-control" onChange={(e) => settitle(e.target.value)} />
                </div>
                <button type="submit" class="btn btn-primary">Search</button>
            </form>
            <div className='container border w-50 my-5 d-flex align-items-center flex-column'>
                <h4 className='my-3'>Searched Movies</h4>
                <div className='row'>
                    <div class="dropdown col">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {year == '0' ? "Select Year  " : year}
                        </button>
                        <div class="dropdown-menu mdrop" aria-labelledby="dropdownMenuButton">
                            {yeararr.map(doc =>
                                <a class="dropdown-item hov" onClick={e => yearsetting(doc)}>{doc}</a>
                            )}
                        </div>
                    </div>
                    <div class="dropdown col">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {sort == 's' ? "Order by  " : sorttt()}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {sortarr.map(doc =>
                                <a class="dropdown-item hov" onClick={e => sortsetting(doc)}>{doc}</a>
                            )}
                        </div>
                    </div>
                </div>
                {searchedmovies.map(doc =>
                    <div class="card my-3 w-100">
                        <ul class="list-group list-group-flush">
                            <img src={doc?.image} class="img-fluid w-25 list-group-item align-self-center bg-light w-25 d-flex align-items-center flex-column" alt="Responsive image" />
                            <li class="list-group-item align-self-center bg-primary w-100 d-flex align-items-center flex-column">{doc?.title}</li>
                            <li class="list-group-item align-self-center bg-warning w-100 d-flex align-items-center flex-column">{doc?.description}</li>
                            <li class="list-group-item align-self-center bg-success w-100 d-flex align-items-center flex-column">{doc?.year}</li>
                            <li class="list-group-item align-self-center bg-light w-100 d-flex align-items-center flex-column">
                                <p>Imdb rating : {doc?.internetrating == 0 ? "N/A" : doc?.internetrating}</p>
                                <p>Metacritic : {doc?.metarating == 0 ? "N/A" : doc?.metarating}</p>
                                <p>Rotten Tomatoes : {doc?.rottenrating == 0 ? "N/A" : doc?.rottenrating}</p>
                            </li>
                            <div className='btn-success btn hov w-25 mx-auto mb-3 mt-3' onClick={e => changeplot(doc?.id)}>Edit Plot</div>
                            <div className='btn-danger btn hov w-25 mx-auto' onClick={e => deletemovie(doc?.id)}>Delete Movie</div>
                        </ul>
                    </div>)
                }
            </div>
        </div>
    )
}

export default Home