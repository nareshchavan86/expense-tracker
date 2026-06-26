using System;

namespace OttPlatform.Core.Entities
{
    public class Favorite : BaseEntity
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int MovieId { get; set; }
        public Movie Movie { get; set; } = null!;
    }
}
