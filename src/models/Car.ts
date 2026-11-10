export interface Car {
    id: string;
    brand: string;
    model: string;
    productionDate: string;
    doorsNumber: number;
    luggageCapacity: number;
    engineCapacity: number;
    fuelType: number;
    averageFuelConsumption: number;
    bodyType: number;
}

export type NewCar = Omit<Car, 'id'>;