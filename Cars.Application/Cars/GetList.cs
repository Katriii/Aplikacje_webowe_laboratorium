using Cars.Application.Cars.DTOs;
using Cars.Application.Cars.Mappers;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class GetList
{
    public class Query : IRequest<List<CarDto?>> { }
    public class Handler : IRequestHandler<Query, List<CarDto?>>
    {
        private readonly DataContext _context;
        public Handler(DataContext context) { _context = context; }
        public async Task<List<CarDto?>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _context.Cars
                .AsNoTracking()
                .Include(c => c.Features)
                .Include(c => c.Photos)
                .Select(car => CarMapper.ToDto(car)).ToListAsync(cancellationToken);
        }   
    }
}