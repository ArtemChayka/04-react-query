import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
    isPending,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery.trim(),
    select: (data) => data,
    placeholderData: keepPreviousData,
  });


  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch movies. Please try again.");
    }
  }, [isError, error]);

  useEffect(() => {
    if (
      isSuccess &&
      moviesData &&
      moviesData.results.length === 0 &&
      !isPending &&
      searchQuery.trim()
    ) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, moviesData, searchQuery, isPending]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
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

  const totalPages = moviesData?.total_pages || 0;
  const movies = moviesData?.results || [];

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      {isPending && isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && (
        <>
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
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
