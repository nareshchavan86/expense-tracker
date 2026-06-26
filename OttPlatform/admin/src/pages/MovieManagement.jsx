import React, { useEffect, useState } from 'react';
import { getMovies } from '../api/services';
import Sidebar from '../components/Sidebar';
import { Plus, Search } from 'lucide-react';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const { data } = await getMovies();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Movie Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition">
            <Plus className="mr-2" size={20} /> Add Movie
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Poster</th>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Rating</th>
                <th className="p-4 font-semibold text-gray-600">Duration</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img src={movie.posterUrl || 'https://via.placeholder.com/50x75'} alt={movie.title} className="w-12 h-18 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium">{movie.title}</td>
                  <td className="p-4">{movie.rating} / 10</td>
                  <td className="p-4">{movie.durationInMinutes} min</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {movies.length === 0 && <div className="p-8 text-center text-gray-500">No movies found.</div>}
        </div>
      </div>
    </div>
  );
};

export default MovieManagement;
