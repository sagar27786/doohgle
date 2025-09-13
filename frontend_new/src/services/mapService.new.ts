export interface IndianCity {
  name: string;
  state: string;
  coordinates: { lat: number; lng: number };
  region: string;
  population: number;
}

export default class MapService {
  private static instance: MapService;

  private constructor() {}

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  getIndianCities(): IndianCity[] {
    return [
      {
        name: "Mumbai",
        state: "Maharashtra",
        coordinates: { lat: 19.076, lng: 72.8777 },
        region: "West",
        population: 20700000,
      },
      {
        name: "Delhi",
        state: "Delhi",
        coordinates: { lat: 28.6139, lng: 77.209 },
        region: "North",
        population: 32900000,
      },
    ];
  }
}
