import { ActionCreator, isActionOf } from 'typesafe-actions';
import { filter } from 'rxjs/operators';

export const filterAction = <AC extends ActionCreator<string>>(action: AC | AC[]) =>
  filter(isActionOf(action));
