using System.Threading.Tasks;
using OttPlatform.Core.Entities;

namespace OttPlatform.Core.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUsernameAsync(string username);
    }
}
