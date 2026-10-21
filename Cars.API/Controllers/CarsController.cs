using Cars.Domain;
using Cars.Application.Cars;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Cars.API.Controllers;

public class CarsController : BaseApiController
{
    private readonly ISender _sender;

    public CarsController(ISender sender) { _sender = sender; }
    
    // GET - api/cars
    [HttpGet]
    public async Task<ActionResult<List<Car>>> GetCars()
    {
        return await _sender.Send(new GetList.Query());
    }

    // GET - api/cars/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Car>> GetCar(Guid id)
    {
        var car = await _sender.Send(new GetById.Query { Id = id });

        if (car is null) return NotFound();

        return car;
    }

    // POST - api/cars
    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        var result = await _sender.Send(new Create.Command { Car = car });

        return CreatedAtAction(
            nameof(GetCar),
            new { id = result.Id },
            result);
    }

    // PUT - api/cars/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCar(Guid id, Car car)
    {
        var result = await _sender.Send(new Edit.Command { Id = id, Car = car });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE - api/cars/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var result = await _sender.Send(new Delete.Command { Id = id });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
