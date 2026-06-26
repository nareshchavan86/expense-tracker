using System;

namespace OttPlatform.Core.Entities
{
    public class WatchHistory : BaseEntity
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int MovieId { get; set; }
        public Movie Movie { get; set; } = null!;

        public long LastWatchedPositionInSeconds { get; set; }
        public bool IsFinished { get; set; }
        public DateTime LastWatchedAt { get; set; } = DateTime.UtcNow;
    }
}
