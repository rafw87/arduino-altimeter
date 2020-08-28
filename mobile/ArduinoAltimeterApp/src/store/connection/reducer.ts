import { ActionType, getType } from 'typesafe-actions';
import * as actions from './actions';
import { ConnectionReducer } from './types';

export const connectionReducerInitialState: ConnectionReducer = {
  status: 'DISCONNECTED',
};

export const connectionReducer = (
  state: ConnectionReducer = connectionReducerInitialState,
  action: ActionType<typeof actions>,
): ConnectionReducer => {
  switch (action.type) {
    case getType(actions.setConnectionStatusAction):
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};
