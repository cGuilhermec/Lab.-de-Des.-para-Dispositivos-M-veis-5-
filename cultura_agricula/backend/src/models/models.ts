export interface CultureInput {
  temperature: number;
  humidity: number;
  soil: string;
}

export interface Culture {
  id: number;
  name: string;
  soil: string;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
}

// Banco em memória de culturas
export let cultures: Culture[] = [
  {
    id: 1,
    name: "Milho",
    soil: "argiloso",
    minTemp: 18,
    maxTemp: 30,
    minHumidity: 50,
    maxHumidity: 80,
  },
  {
    id: 2,
    name: "Soja",
    soil: "silto-argiloso",
    minTemp: 20,
    maxTemp: 32,
    minHumidity: 45,
    maxHumidity: 75,
  },
  {
    id: 3,
    name: "Trigo",
    soil: "arenoso",
    minTemp: 10,
    maxTemp: 25,
    minHumidity: 40,
    maxHumidity: 70,
  },
];
