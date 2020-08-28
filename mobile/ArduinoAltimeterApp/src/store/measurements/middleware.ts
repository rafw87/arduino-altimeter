import { Action, Middleware } from 'redux';
import { updateMeasurementsAction } from './actions';
import { BluetoothService } from '../../services';

type createMeasurementsMiddlewareArgs<S, A extends Action> = {
  bluetoothService: BluetoothService;
};

export const createMeasurementsMiddleware = <S, A extends Action>({
  bluetoothService,
}: createMeasurementsMiddlewareArgs<S, A>): Middleware<{}, S> => (store) => {
  bluetoothService.subscribeForMeasurements(bluetoothService.allMeasurements, (measurements) => {
    store.dispatch(updateMeasurementsAction(measurements));
  });
  return (next) => (action: A) => next(action);
};
