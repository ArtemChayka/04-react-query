import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { type Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setMovies([]); 

      const response = await fetchMovies(query);
      

      if (response.results.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(response.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {hasError && <ErrorMessage />}
      {!isLoading && !hasError && (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

