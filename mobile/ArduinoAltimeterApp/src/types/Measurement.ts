import { getKeys } from '../utils';

export enum Measurement {
  temperature = 'temperature',
  humidity = 'humidity',
  pressure = 'pressure',
  seaLevelPressure = 'seaLevelPressure',
  altitude = 'altitude',
  minAlt = 'minAlt',
  maxAlt = 'maxAlt',
  avgAlt = 'avgAlt',
  descend = 'descend',
  ascend = 'ascend',
}

export const allMeasurements = getKeys(Measurement) as Measurement[];
