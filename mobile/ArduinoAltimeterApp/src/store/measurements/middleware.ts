import { Action, Middleware } from 'redux';
import { updateMeasurementsAction } from './actions';
import { BluetoothService } from '../../services';
import { allMeasurements } from '../../types';

type createMeasurementsMiddlewareArgs<S, A extends Action> = {
  bluetoothService: BluetoothService;
};

export const createMeasurementsMiddleware = <S, A extends Action>({
  bluetoothService,
}: createMeasurementsMiddlewareArgs<S, A>): Middleware<{}, S> => (store) => {
  bluetoothService.subscribeForMeasurements(allMeasurements, (measurements) => {
    store.dispatch(updateMeasurementsAction(measurements));
  });
  return (next) => (action: A) => next(action);
};
