using Cars.Application.Cars.DTOs;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Cars.Application.Cars.Mappers;

namespace Cars.Application.Cars;

public class GetById
{
    public class Query : IRequest<CarDto?> 
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, CarDto?>
    {
        private readonly DataContext _context;
        public Handler(DataContext context) { _context = context; }

        //public async Task<Car?> Handle(Query request, CancellationToken cancellationToken)
        //{
        //    return await _context.Cars.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        //}
        public async Task<CarDto?> Handle(Query request, CancellationToken cancellationToken)
        {
            Car car = await _context.Cars
                .Include(c => c.Features)
                .Include(c => c.Photos)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            return CarMapper.ToDto(car);
        }
    }
}

