import axios from "axios";
import { type Movie } from "../types/movie";

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const res = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
console.log(res);

  return res.data;
};
