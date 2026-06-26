using System;
using System.Threading.Tasks;
using OttPlatform.Core.Entities;
using OttPlatform.Core.Interfaces;
using OttPlatform.Infrastructure.Data;

namespace OttPlatform.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly OttDbContext _context;
        public IMovieRepository Movies { get; private set; }
        public IUserRepository Users { get; private set; }
        public IRepository<Category> Categories { get; private set; }
        public IRepository<Favorite> Favorites { get; private set; }
        public IRepository<WatchHistory> WatchHistories { get; private set; }

        public UnitOfWork(OttDbContext context)
        {
            _context = context;
            Movies = new MovieRepository(_context);
            Users = new UserRepository(_context);
            Categories = new Repository<Category>(_context);
            Favorites = new Repository<Favorite>(_context);
            WatchHistories = new Repository<WatchHistory>(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
