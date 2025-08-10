import axios from "axios";
import { type MoviesResponse } from "../types/movie";

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
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
console.log(response);

  return response.data;
};
