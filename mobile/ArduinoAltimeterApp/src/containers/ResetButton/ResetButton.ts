import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  resetMeasurementsClickAction,
  selectResetMeasurementsClicks,
  selectResetMeasurementsRemainedClicks,
} from '../../store/measurements';
import { ResetButtonPure, OwnProps, DispatchProps, StateProps } from './ResetButtonPure';

export const mapStateToProps = (state: AppState) => ({
  clicks: selectResetMeasurementsClicks(state),
  remainedClicks: selectResetMeasurementsRemainedClicks(state),
});

const mapDispatchToProps = {
  resetClick: resetMeasurementsClickAction,
};

export const ResetButton = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps,
)(ResetButtonPure);

export type ResetButtonProps = OwnProps;
