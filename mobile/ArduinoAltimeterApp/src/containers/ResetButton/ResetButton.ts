import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  resetMeasurementsClickAction,
  selectResetMeasurementsState,
  selectResetMeasurementsInProgress,
  selectResetMeasurementsError,
  resetMeasurementsConfirmAction,
} from '../../store/measurements';
import { ResetButtonPure, OwnProps, DispatchProps, StateProps } from './ResetButtonPure';

export const mapStateToProps = (state: AppState) => ({
  state: selectResetMeasurementsState(state),
  inProgress: selectResetMeasurementsInProgress(state),
  error: selectResetMeasurementsError(state),
});

const mapDispatchToProps = {
  reset: resetMeasurementsClickAction,
  confirm: resetMeasurementsConfirmAction,
};

export const ResetButton = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButtonPure);

export type ResetButtonProps = OwnProps;
