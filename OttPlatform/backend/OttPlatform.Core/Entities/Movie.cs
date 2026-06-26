using System;
using System.Collections.Generic;

namespace OttPlatform.Core.Entities
{
    public class Movie : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? StreamingUrl { get; set; } // HLS .m3u8 URL
        public string? TrailerUrl { get; set; }
        public int DurationInMinutes { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public double Rating { get; set; }
        public bool IsPremium { get; set; } = false;

        public ICollection<MovieCategory> MovieCategories { get; set; } = new List<MovieCategory>();
    }
}
