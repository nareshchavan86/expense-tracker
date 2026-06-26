using System;
using System.Threading.Tasks;
using OttPlatform.Core.Entities;

namespace OttPlatform.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IMovieRepository Movies { get; }
        IUserRepository Users { get; }
        IRepository<Category> Categories { get; }
        IRepository<Favorite> Favorites { get; }
        IRepository<WatchHistory> WatchHistories { get; }
        Task<int> CompleteAsync();
    }
}
