import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import s from "./movie.module.css"
import Loader from './Loader';
import ReactPaginate from 'react-paginate';
const MovieReducer = () => {
    let initialState = {
        movie: [],
        loading: false,
        error: null,
        pagination: true
    }
    let SearchReducer = (currentState, action) => {
        console.log({ movie: action.values });
        if (action.type == 'request') {
            return { ...currentState, loading: true, movie: [], pagination: false }
        }
        else if (action.type == 'success') {
            return { ...currentState, movie: action.values, loading: false, pagination: true }
        }
        else if (action.type == 'error') {
            return { ...currentState, movie: action.error, pagination: false }
        }
    }
    let [state, dispatcher] = useReducer(SearchReducer, initialState)
    let [search, setsearch] = useState("");
    let [searchedMovie, setsearchedMovie] = useState("avengers");
    let [totalpage, settotalpage] = useState(0);
    let Moviefn = async (page) => {
        dispatcher({ type: 'request' });
        try {
            let apidata = await axios.get(`https://www.omdbapi.com/?s=${searchedMovie}&page=${page}&&apikey=4d8bec6f`);
            // console.log(apidata.data.Search);
            let rawarray = apidata.data.Search || [];
            let totalmov = Math.ceil(apidata.data.totalResults / 10)
            settotalpage(totalmov)
            // console.log(apiData.data);
            dispatcher({ type: 'success', values: rawarray })
        }
        catch (err) {
            console.log(err.message)
            dispatcher({ type: 'error', values: err.message })
        }
    }
    let updateSearch = ({ target: { value } }) => {
        setsearch(value)
    }
    let searchMovie = () => {
        setsearchedMovie(search)
    }
    let handlePageClick = (event) => {
        // console.log(event);    
        let selectedPage = event.selected + 1;
        console.log(selectedPage);
        Moviefn(selectedPage);
    };
    let handleevent = (event) => {
        console.log(event.key)
        if (event.key === "Enter") {
            searchMovie()
        }
    }
    useEffect(() => {
        Moviefn();
    }, [searchedMovie])
    return (
        <div>
            <div className={s.searchbox}>
                <input type="text"
                    placeholder='Search the movies'
                    onChange={updateSearch}
                    onKeyDown={handleevent}
                />
                <button onClick={searchMovie}>Search</button>
            </div>
            {state.loading && <div className={s.loader}>
                <Loader />
            </div>}
            {state.error && <div className={s.error}>
                {state.error}
            </div>}
            <div className={s.container} >
                {state.movie.map((m) => {
                    return (
                        <div key={m.imdbID}>
                            <>
                                <div className={s.align} >
                                    <img src={m.Poster} />
                                    <div className={s.Conbox}>
                                        <h1>{m.Title}</h1>
                                        <h1 >{m.Year}</h1>
                                        <a href={`https://www.imdb.com/title/${m.imdbID}`} target="_blank" >IMDb</a>
                                    </div>
                                </div>
                            </>
                        </div>
                    )
                })
                }
            </div>
            {state.pagination &&
                <div >
                    <ReactPaginate
                        className={s.pagin}
                        breakLabel="..."
                        nextLabel="Next >"
                        previousLabel="< Previous"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={totalpage}
                        renderOnZeroPageCount={null}
                        activeClassName={s.active} // This should refer to a CSS class that styles the active page
                    />

                </div>
            }
        </div>
    )
}
export default MovieReducer
