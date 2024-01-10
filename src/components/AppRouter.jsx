import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TVShows from './TVShows';
import MovieDetails from './MovieDetails.jsx';
import Navbar from './Navbar';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/tv-shows" component={TVShows} />
        <Route path="/movie-details/:movieId" component={MovieDetails} />
      </Switch>
    </Router>
  );
};

export default AppRouter;