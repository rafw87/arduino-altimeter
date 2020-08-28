import { combineEpics } from 'redux-observable';

export type ConnectionEpicsDependencies = {};

export const connectionEpics = combineEpics();
