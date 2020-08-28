import { AppState } from '../rootReducer';

export const selectConnectionStatus = (state: AppState) => state.connection.status;
