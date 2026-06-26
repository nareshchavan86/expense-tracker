import api from './axios';

export const login = (emailOrUsername, password) =>
  api.post('/auth/login', { emailOrUsername, password });

export const getMovies = () => api.get('/movies');
export const createMovie = (movie) => api.post('/movies', movie);
export const searchMovies = (query) => api.get(`/movies/search?q=${query}`);
