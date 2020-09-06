import { combineEpics, Epic } from 'redux-observable';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, takeUntil, catchError, bufferTime } from 'rxjs/operators';
import { BluetoothService } from '../../services';
import { filterAction, ObservableService } from '../../utils';
import { AppActions, AppState } from '../rootReducer';
import {
  resetMeasurementsAction,
  resetMeasurementsClickAction,
  resetMeasurementsClickTimeoutAction,
  saveMeasurementAction,
} from './actions';
import { RESET_CLICK_COUNT, RESET_CLICK_TIMEOUT } from './constants';

export type MeasurementsEpicsDependencies = {
  bluetooth: ObservableService<BluetoothService>;
};

const saveMeasurementEpic: Epic<AppActions, AppActions, AppState, MeasurementsEpicsDependencies> = (
  action$,
  _, // store$
  { bluetooth },
) =>
  action$.pipe(
    filterAction(saveMeasurementAction.request),
    mergeMap(({ payload: { measurement, value } }) =>
      bluetooth.writeMeasurementValue(measurement, value).pipe(
        takeUntil(action$.pipe(filterAction([saveMeasurementAction.request]))),
        // map promise result to success action
        map((result) => saveMeasurementAction.success(result)),
        // catch error if any and emit failure action
        catchError((error: Error) => of(saveMeasurementAction.failure({ measurement, error }))),
      ),
    ),
  );

const resetMeasurementsClickEpic: Epic<
  AppActions,
  AppActions,
  AppState,
  MeasurementsEpicsDependencies
> = (
  action$,
  _, // store$
  { bluetooth },
) =>
  action$.pipe(
    filterAction(resetMeasurementsClickAction),
    bufferTime(RESET_CLICK_TIMEOUT, null, RESET_CLICK_COUNT),
    mergeMap((events) => {
      if (events.length >= RESET_CLICK_COUNT) {
        console.log('EVENTS', events);
        return of(resetMeasurementsAction.request());
      } else if (events.length > 0) {
        console.log('EVENTS', events);
        return of(resetMeasurementsClickTimeoutAction());
      }
      return EMPTY;
    }),
  );

const resetMeasurementsEpic: Epic<
  AppActions,
  AppActions,
  AppState,
  MeasurementsEpicsDependencies
> = (
  action$,
  _, // store$
  { bluetooth },
) =>
  action$.pipe(
    filterAction(resetMeasurementsAction.request),
    mergeMap(() =>
      bluetooth.resetMeasurements().pipe(
        map((result) => resetMeasurementsAction.success()),
        catchError((error: Error) => of(resetMeasurementsAction.failure(error))),
      ),
    ),
  );

export const measurementsEpics = combineEpics(
  saveMeasurementEpic,
  resetMeasurementsClickEpic,
  resetMeasurementsEpic,
);
