using System;
using System.Collections.Generic;

namespace OttPlatform.Core.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Role> Roles { get; set; } = new List<Role>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<WatchHistory> WatchHistories { get; set; } = new List<WatchHistory>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
