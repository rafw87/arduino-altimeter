import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { toObservable } from '../utils';
import { AppActions, AppState } from './rootReducer';
import { measurementsEpics, MeasurementsEpicsDependencies } from './measurements/epics';
import { connectionEpics, ConnectionEpicsDependencies } from './connection/epics';
import { Services } from './types';

type Dependencies = ConnectionEpicsDependencies & MeasurementsEpicsDependencies;
export const buildEpicMiddleware = ({ bluetoothService }: Services) => {
  const epicMiddleware = createEpicMiddleware<AppActions, AppActions, AppState, Dependencies>({
    dependencies: {
      bluetooth: toObservable(bluetoothService),
    },
  });
  const rootEpic = combineEpics(connectionEpics, measurementsEpics);
  return { epicMiddleware, rootEpic };
};
