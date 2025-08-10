import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import { type Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const {
    data: moviesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery, // дозволяє якщо є запит
    select: (data) => data,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // скинули до 1 стор
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  // toast відпрацьовує якщо нема результату
  if (moviesData && moviesData.results.length === 0 && !isLoading) {
    toast.error("No movies found for your request.");
  }

  // toast відпрацьовує якщо помилканема результату
  if (isError && error) {
    toast.error("Failed to fetch movies. Please try again.");
  }

  const totalPages = moviesData?.total_pages || 0;
  const movies = moviesData?.results || [];

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <>
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
              breakLabel="..."
              disabledClassName={css.disabled}
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
