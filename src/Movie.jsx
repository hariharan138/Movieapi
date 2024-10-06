import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import "./OmdbMovies.css"
// import Loader from './Loader';

function Movie() {

    let [movies, setmovies] = useState([]);
    let [search, setsearch] = useState("");
    let [searchedMovie, setsearchedMovie] = useState("avengers");
    let [loading, setloading] = useState(false);
    let [error, seterror] = useState(false);

    let updateUsers = async () => {
        setloading(true)
        try {
            let { data:{Search} } = await axios.get(`https://www.omdbapi.com/?s=${searchedMovie}&apikey=4d8bec6f`);
            setmovies(Search)
            setloading(false)
        }
        catch (err) {
            console.log(err)
            seterror(true)
            setloading(false)
        }
    }

    let updateSearch = ({ target: { value } }) =>
    {
        setsearch(value)
    }

    useEffect(() => {
        updateUsers();
    }, [searchedMovie])

    console.log(movies)

    let searchMovie = () =>
    {
        setsearchedMovie(search)
    }

  return (
      <section className='omdb'>
      
          {error && <h1 style={{color:"Red",fontSize:"40px"}}>API Error</h1>}
          <div className='search'>
              <input type="search" placeholder='Movie Name' onChange={updateSearch} />
              <button onClick={searchMovie}>Search</button>
          </div>
          <div className='movie-list'>
        {movies?movies?.map((movie) =>
            {
            return <div key={movie.imdbID} className='movie'>
                    <img src={movie.Poster} alt="No Image" />
                </div>
        }):<h1 style={{color:"white"}}>No Movie Found</h1>}
          </div>

    </section>
  )
}

export default Movie