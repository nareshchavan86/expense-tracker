using Microsoft.EntityFrameworkCore;
using OttPlatform.Core.Entities;

namespace OttPlatform.Infrastructure.Data
{
    public class OttDbContext : DbContext
    {
        public OttDbContext(DbContextOptions<OttDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<MovieCategory> MovieCategories { get; set; } = null!;
        public DbSet<Favorite> Favorites { get; set; } = null!;
        public DbSet<WatchHistory> WatchHistories { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovieCategory>()
                .HasKey(mc => new { mc.MovieId, mc.CategoryId });

            modelBuilder.Entity<MovieCategory>()
                .HasOne(mc => mc.Movie)
                .WithMany(m => m.MovieCategories)
                .HasForeignKey(mc => mc.MovieId);

            modelBuilder.Entity<MovieCategory>()
                .HasOne(mc => mc.Category)
                .WithMany(c => c.MovieCategories)
                .HasForeignKey(mc => mc.CategoryId);

            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin", CreatedAt = System.DateTime.UtcNow },
                new Role { Id = 2, Name = "User", CreatedAt = System.DateTime.UtcNow }
            );
        }
    }
}
