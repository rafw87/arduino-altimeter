import { combineEpics, Epic } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap, map, takeUntil, catchError } from 'rxjs/operators';
import { BluetoothService } from '../../services';
import { filterAction, ObservableService } from '../../utils';
import { AppActions, AppState } from '../rootReducer';
import { saveMeasurementAction } from './actions';

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

export const measurementsEpics = combineEpics(saveMeasurementEpic);
