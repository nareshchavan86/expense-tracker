using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OttPlatform.Core.Entities;
using OttPlatform.Core.Interfaces;
using OttPlatform.Infrastructure.Data;

namespace OttPlatform.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(OttDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Username == username);
        }
    }
}
