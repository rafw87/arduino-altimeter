import { createAction } from 'typesafe-actions';
import { ConnectionStatus } from './types';

export const setConnectionStatusAction = createAction('@CONNECTION/SET_CONNECTION_STATUS')<
  ConnectionStatus
>();
