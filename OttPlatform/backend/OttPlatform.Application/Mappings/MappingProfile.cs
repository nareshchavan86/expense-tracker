using AutoMapper;
using OttPlatform.Application.DTOs;
using OttPlatform.Core.Entities;
using System.Linq;

namespace OttPlatform.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();

            CreateMap<Movie, MovieDto>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.MovieCategories.Select(mc => mc.Category)));

            CreateMap<Category, CategoryDto>();

            CreateMap<CreateMovieRequest, Movie>();
        }
    }
}
