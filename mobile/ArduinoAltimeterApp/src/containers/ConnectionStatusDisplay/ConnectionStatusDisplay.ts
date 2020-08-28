import { connect } from 'react-redux';
import {
  ConnectionStatusDisplayPure,
  OwnProps,
  DispatchProps,
  StateProps,
} from './ConnectionStatusDisplayPure';
import { AppState } from '../../store';

import { selectConnectionStatus } from '../../store/connection';

export const mapStateToProps = (state: AppState) => ({
  status: selectConnectionStatus(state),
});

const mapDispatchToProps = {};

export const ConnectionStatusDisplay = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionStatusDisplayPure);

export type ConnectionStatusDisplayProps = OwnProps;
