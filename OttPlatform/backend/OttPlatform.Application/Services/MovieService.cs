using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using OttPlatform.Application.DTOs;
using OttPlatform.Core.Entities;
using OttPlatform.Core.Interfaces;

namespace OttPlatform.Application.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllMoviesAsync();
        Task<MovieDto?> GetMovieByIdAsync(int id);
        Task<MovieDto> CreateMovieAsync(CreateMovieRequest request);
        Task<IEnumerable<MovieDto>> SearchMoviesAsync(string term);
    }

    public class MovieService : IMovieService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MovieService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync()
        {
            var movies = await _unitOfWork.Movies.GetAllAsync();
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }

        public async Task<MovieDto?> GetMovieByIdAsync(int id)
        {
            var movie = await _unitOfWork.Movies.GetByIdAsync(id);
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<MovieDto> CreateMovieAsync(CreateMovieRequest request)
        {
            var movie = _mapper.Map<Movie>(request);
            await _unitOfWork.Movies.AddAsync(movie);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<IEnumerable<MovieDto>> SearchMoviesAsync(string term)
        {
            var movies = await _unitOfWork.Movies.SearchMoviesAsync(term);
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
    }
}
