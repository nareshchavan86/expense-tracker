using System;
using System.Collections.Generic;

namespace OttPlatform.Application.DTOs
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PosterUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? StreamingUrl { get; set; }
        public int DurationInMinutes { get; set; }
        public double Rating { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public bool IsPremium { get; set; }
        public List<CategoryDto> Categories { get; set; } = new();
    }

    public class CreateMovieRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DurationInMinutes { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public bool IsPremium { get; set; }
        public List<int> CategoryIds { get; set; } = new();
    }
}
