import { connect } from 'react-redux';
import {
  MeasurementDisplayPure,
  OwnProps,
  DispatchProps,
  StateProps,
} from './MeasurementDisplayPure';
import { AppState } from '../../store';
import {
  saveMeasurementAction,
  selectDraftMeasurementValueToDisplay,
  selectEditMode,
  selectMeasurementValueToDisplay,
  setMeasurementEditModeAction,
  updateMeasurementDraftValueAction,
} from '../../store/measurements';

export const mapStateToProps = (state: AppState, props: OwnProps) => ({
  value: selectMeasurementValueToDisplay(props.measurement)(state),
  draftValue: selectDraftMeasurementValueToDisplay(props.measurement)(state),
  editMode: selectEditMode(props.measurement)(state),
});

const mapDispatchToProps = {
  updateDraft: updateMeasurementDraftValueAction,
  saveMeasurement: saveMeasurementAction.request,
  setEditMode: setMeasurementEditModeAction,
};

export const MeasurementDisplay = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps,
)(MeasurementDisplayPure);

export type MeasurementDisplayProps = OwnProps;
