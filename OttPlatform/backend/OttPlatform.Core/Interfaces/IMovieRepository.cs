using System.Collections.Generic;
using System.Threading.Tasks;
using OttPlatform.Core.Entities;

namespace OttPlatform.Core.Interfaces
{
    public interface IMovieRepository : IRepository<Movie>
    {
        Task<IEnumerable<Movie>> SearchMoviesAsync(string searchTerm);
        Task<IEnumerable<Movie>> GetMoviesByCategoryAsync(int categoryId);
        Task<IEnumerable<Movie>> GetTrendingMoviesAsync(int count);
    }
}
