import axios from "axios";
import { type Movie } from "../types/movie";

interface MoviesResponse {
    results: Movie[]
}

export const fetchMovies = async (query: string): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
console.log(response);

  return response.data;
};
