export interface Observation {
  stationID: string;
  obsTimeUtc: string;
  obsTimeLocal: string;
  neighborhood: string;
  softwareType: string;
  country: string;
  solarRadiation: null | number;
  lon: null | number;
  realtimeFrequency: null | number;
  epoch: number;
  lat: null | number;
  uv: null | number;
  winddir: null | number;
  humidity: number;
  qcStatus: number;
  metric: {
    temp: number;
    heatIndex: number;
    dewpt: number;
    windChill: number;
    windSpeed: number;
    windGust: number;
    pressure: number;
    precipRate: number;
    precipTotal: number;
    elev: number;
  };
}
export interface ObservationsResponse {
  observations: Observation[];
}
