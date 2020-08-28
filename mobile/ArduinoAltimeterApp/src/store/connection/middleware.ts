import { Action, Middleware } from 'redux';
import { setConnectionStatusAction } from './actions';
import { BluetoothService } from '../../services';

type CreateConnectionMiddlewareArgs<S, A extends Action> = {
  bluetoothService: BluetoothService;
};

export const createConnectionMiddleware = <S, A extends Action>({
  bluetoothService,
}: CreateConnectionMiddlewareArgs<S, A>): Middleware<{}, S> => (store) => {
  bluetoothService.subscribeForStatus((status) => {
    store.dispatch(setConnectionStatusAction(status));
  });
  return (next) => (action: A) => next(action);
};
