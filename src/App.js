import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/styles.css";
import { Container, Alert, Dropdown } from "react-bootstrap";
import MyNavbar from "./components/MyNavbar";
import MyFooter from "./components/MyFooter";
import MovieList from "./components/MovieList";
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter';

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

class App extends Component {
  state = {
    gallery1: [],
    gallery2: [],
    gallery3: [],
    searchResults: [],
    loading: true,
    error: false,
    comments: [],
  };

  OMDB_URL = "http://www.omdbapi.com/?apikey=7dcf0c13";

  componentDidMount = () => {
    this.fetchMovies();
  };

  fetchMovies = () => {
    Promise.all([
      fetch(this.OMDB_URL + "&s=harry%20potter")
        .then((response) => response.json())
        .then((responseObject) => {
          if (responseObject.Response === "True") {
            console.log(responseObject);
            this.setState({ gallery1: responseObject.Search });
          } else {
            this.setState({ error: true });
          }
        }),
      fetch(this.OMDB_URL + "&s=avengers")
        .then((response) => response.json())
        .then((responseObject) => {
          if (responseObject.Response === "True") {
            this.setState({ gallery2: responseObject.Search });
          } else {
            this.setState({ error: true });
          }
        }),
      fetch(this.OMDB_URL + "&s=star%20wars")
        .then((response) => response.json())
        .then((responseObject) => {
          if (responseObject.Response === "True") {
            this.setState({ gallery3: responseObject.Search });
          } else {
            this.setState({ error: true });
          }
        }),
    ])
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ error: true });
        console.log("An error has occurred:", err);
      });
  };

  showSearchResult = async (searchString) => {
    if (searchString === "") {
      this.setState({ error: false, searchResults: [] }, () => {
        this.fetchMovies();
      });
    } else {
      try {
        const response = await fetch(this.OMDB_URL + "&s=" + searchString);
        if (response.ok) {
          const data = await response.json();
          if (data.Response === "True") {
            this.setState({
              searchResults: data.Search,
              error: false,
            });
          } else {
            this.setState({ error: true });
          }
        } else {
          this.setState({ error: true });
          console.log("an error occurred");
        }
      } catch (error) {
        this.setState({ error: true });
        console.log(error);
      }
    }
  };

  fetchComments = async (movieID) => {
    const COMMENTS_URL = "https://striveschool-api.herokuapp.com/api/comments/";
    try {
      const response = await fetch(COMMENTS_URL + movieID, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTljMTVlYWUwZGQxZDAwMTgyZDE4MzUiLCJpYXQiOjE3MDQ3MjgwNDIsImV4cCI6MTcwNTkzNzY0Mn0.d3NYogX9x1Trv4HDeBugXlpKHp-yZ-GurJVZjxwKc_w",
        },
      });
      if (response.ok) {
        const comments = await response.json();
        this.setState({ comments });
      } else {
        console.log("an error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <MyNavbar showSearchResult={this.showSearchResult} />
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <h2 className="mb-4">TV Shows</h2>
              <div className="ml-4 mt-1">
                <Dropdown>
                  <Dropdown.Toggle
                    style={{ backgroundColor: "#221f1f" }}
                    id="dropdownMenuButton"
                    className="btn-secondary btn-sm dropdown-toggle rounded-0"
                  >
                    Genres
                  </Dropdown.Toggle>
                  <Dropdown.Menu bg="dark">
                    <Dropdown.Item href="#/action-1">Comedy</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Drama</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Thriller</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div>
              <i className="fa fa-th-large icons"></i>
              <i className="fa fa-th icons"></i>
            </div>
          </div>
          {this.state.error && (
            <Alert variant="danger" className="text-center">
              An error has occurred, please try again!
            </Alert>
          )}
          {this.state.searchResults?.length > 0 && (
            <MovieList
              title="Search results"
              fetchComments={this.fetchComments}
              comments={this.state.comments}
              movies={this.state.searchResults}
            />
          )}
          {!this.state.error && !this.state.searchResults?.length > 0 && (
            <>
              <MovieList
                title="Harry Potter"
                loading={this.state.loading}
                fetchComments={this.fetchComments}
                comments={this.state.comments}
                movies={this.state.gallery1.slice(0, 6)}
              />
              <MovieList
                title="Avengers"
                loading={this.state.loading}
                fetchComments={this.fetchComments}
                comments={this.state.comments}
                movies={this.state.gallery2.slice(0, 6)}
              />
              <MovieList
                title="Star Wars"
                loading={this.state.loading}
                fetchComments={this.fetchComments}
                comments={this.state.comments}
                movies={this.state.gallery3.slice(0, 6)}
              />
            </>
          )}
          <MyFooter />
        </Container>
      </div>
    );
  }
  
  
}

export default App;
