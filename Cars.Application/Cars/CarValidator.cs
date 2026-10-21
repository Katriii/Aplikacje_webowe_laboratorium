using Cars.Domain;
using FluentValidation;

namespace Cars.Applicatiton.Cars;

public class CarValidator : AbstractValidator<Car>
{
    public CarValidator()
    {
        RuleFor(x => x.Brand)
            .NotEmpty()
            .WithMessage("A brand is required.")
            .MaximumLength(50)
            .WithMessage("The brand cannot be larger than 50 characters.");

        RuleFor(x => x.Model)
            .NotEmpty()
            .WithMessage("A model is required.")
            .MaximumLength(50)
            .WithMessage("The model cannot be larger than 50 characters.");

        RuleFor(x => x.DoorsNumber)
            .InclusiveBetween(2, 5)
            .WithMessage("Doors number must be between 2 and 5.");
        
        RuleFor(x => x.LuggageCapacity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("The luggage capacity cannot be negative.");
       
        RuleFor(x => x.EngineCapacity)
            .GreaterThan(0)
            .WithMessage("The engine capacity must be greater than 0.");

        RuleFor(x => x.ProductionDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("The production date cannot be in the future.");

        RuleFor(x => x.AverageFuelConsumption)
            .GreaterThan(0)
            .WithMessage("The average fuel consumption must be greater than 0.");
    }
}
