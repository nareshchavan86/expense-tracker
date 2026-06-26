using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OttPlatform.Core.Entities;
using OttPlatform.Core.Interfaces;
using OttPlatform.Infrastructure.Data;

namespace OttPlatform.Infrastructure.Repositories
{
    public class MovieRepository : Repository<Movie>, IMovieRepository
    {
        public MovieRepository(OttDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Movie>> SearchMoviesAsync(string searchTerm)
        {
            return await _context.Movies
                .Where(m => m.Title.Contains(searchTerm) || m.Description.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<IEnumerable<Movie>> GetMoviesByCategoryAsync(int categoryId)
        {
            return await _context.MovieCategories
                .Where(mc => mc.CategoryId == categoryId)
                .Select(mc => mc.Movie)
                .ToListAsync();
        }

        public async Task<IEnumerable<Movie>> GetTrendingMoviesAsync(int count)
        {
            return await _context.Movies
                .OrderByDescending(m => m.Rating)
                .Take(count)
                .ToListAsync();
        }
    }
}
