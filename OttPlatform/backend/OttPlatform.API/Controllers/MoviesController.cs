using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OttPlatform.Application.DTOs;
using OttPlatform.Application.Services;

namespace OttPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _movieService.GetAllMoviesAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var movie = await _movieService.GetMovieByIdAsync(id);
            if (movie == null) return NotFound();
            return Ok(movie);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateMovieRequest request)
        {
            var movie = await _movieService.CreateMovieAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            return Ok(await _movieService.SearchMoviesAsync(q));
        }
    }
}
