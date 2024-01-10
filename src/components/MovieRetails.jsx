// MovieDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetails = ({ match }) => {
  const { movieId } = match.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        
        const omdbResponse = await axios.get(`http://www.omdbapi.com/?i=${movieId}&apikey=cd9efd9e`);
        const omdbData = omdbResponse.data;

    
        const commentsResponse = await axios.get(`https://api.example.com/comments/${movieId}`);
        const commentsData = commentsResponse.data;

        
        setMovieDetails(omdbData);
        setComments(commentsData);
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]); 

  return (
    <div>
      {movieDetails && (
        <div>
          <h2>{movieDetails.Title}</h2>
          <p>Year: {movieDetails.Year}</p>
          <p>Plot: {movieDetails.Plot}</p>
        
        </div>
      )}

      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
 