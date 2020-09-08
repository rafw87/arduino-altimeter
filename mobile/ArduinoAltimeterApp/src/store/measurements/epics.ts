import { combineEpics, Epic } from 'redux-observable';
import { of, timer } from 'rxjs';
import { mergeMap, map, takeUntil, catchError } from 'rxjs/operators';
import { BluetoothService } from '../../services';
import { filterAction, ObservableService } from '../../utils';
import { AppActions, AppState } from '../rootReducer';
import {
  resetMeasurementsAction,
  resetMeasurementsClickAction,
  resetMeasurementsConfirmAction,
  resetMeasurementsResetAction,
  saveMeasurementAction,
} from './actions';
import { FINAL_NOTIFICATION_TIMEOUT, RESET_CLICK_TIMEOUT } from './constants';

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
> = (action$) =>
  action$.pipe(
    filterAction(resetMeasurementsClickAction),
    mergeMap(() =>
      timer(RESET_CLICK_TIMEOUT).pipe(
        takeUntil(action$.pipe(filterAction(resetMeasurementsConfirmAction))),
        map(() => resetMeasurementsResetAction()),
      ),
    ),
  );

const resetMeasurementsConfirmEpic: Epic<
  AppActions,
  AppActions,
  AppState,
  MeasurementsEpicsDependencies
> = (action$) =>
  action$.pipe(
    filterAction(resetMeasurementsConfirmAction),
    map(() => resetMeasurementsAction.request()),
  );

const resetMeasurementsFinishEpic: Epic<
  AppActions,
  AppActions,
  AppState,
  MeasurementsEpicsDependencies
> = (action$) =>
  action$.pipe(
    filterAction([resetMeasurementsAction.success, resetMeasurementsAction.failure]),
    mergeMap(() =>
      timer(FINAL_NOTIFICATION_TIMEOUT).pipe(
        takeUntil(action$.pipe(filterAction(resetMeasurementsClickAction))),
        map(() => resetMeasurementsResetAction()),
      ),
    ),
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
  resetMeasurementsConfirmEpic,
  resetMeasurementsFinishEpic,
  resetMeasurementsEpic,
);
