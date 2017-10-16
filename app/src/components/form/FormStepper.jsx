import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Card, CardText } from "material-ui/Card";
import Button from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { reduxForm, getFormSyncErrors } from "redux-form";
import Spinner from "../utils/Spinner";
import Stepper from "material-ui/Stepper/Stepper";
import Step from "material-ui/Stepper/Step";
import StepButton from "material-ui/Stepper/StepButton";
import StepContent from "material-ui/Stepper/StepContent";
import StepLabel from "material-ui/Stepper/StepLabel";
import WarningIcon from "material-ui/svg-icons/alert/warning";
import { red500 } from "material-ui/styles/colors";
import _max from "lodash/max";
import AnimateHeight from "react-animate-height";
import { hasError } from "./ReduxFormUtils";

const sectionErrorIcon = <WarningIcon color={red500} />;

/**
 * A general component that helps rendering a stepper with
 * multiple sections powered by redux-form.
 * All stepper-state and logic is encapsulated in this component.
 *
 * All validation is done through redux-form.
 */

const styles = {
    nextButton: {
        position: "absolute",
        right: 0
    },
    backButton: {
        position: "absolute",
        left: 0
    }
};

class FormStepper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stepIndex: 0,
            completed: [],
            visited: [],
            sectionHeight: "auto"
        };

        this.getSectionName = this.getSectionName.bind(this);
        this.updateStateForStep = this.updateStateForStep.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.goToStep = this.goToStep.bind(this);
        this.renderStepActions = this.renderStepActions.bind(this);
    }

    getSectionName(id) {
        return this.props.sections[id].props.name;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.sectionHeight !== "auto") {
            this.setState({
                ...this.state,
                sectionHeight: "auto"
            });
        }
    }

    updateStateForStep(nextStep) {
        const currStep = this.state.stepIndex;
        if (currStep == nextStep) return;
        const currSection = this.getSectionName(currStep);
        const errorFields = this.props.errorState[currSection];
        const completedWithoutCurrent = this.state.completed.filter(
            step => step !== currStep
        );
        this.setState({
            ...this.state,
            stepIndex: nextStep,
            completed: hasError(errorFields)
                ? completedWithoutCurrent
                : completedWithoutCurrent.concat(currStep),
            visited: this.state.visited.concat(currStep),
            sectionHeight: 0
        });
    }

    nextStep() {
        const currStep = this.state.stepIndex;
        const currSection = this.getSectionName(currStep);
        const errorFields = this.props.errorState[currSection];
        const errorFieldNames = Object.keys(errorFields).map(
            (field, i) => `${currSection}.${field}`
        );
        //Touch all fields that has an error, so that the fields are updated to show the error
        //and prevent transition
        if (errorFieldNames.length > 0) {
            this.props.touch(...errorFieldNames);
            return;
        }

        this.updateStateForStep(currStep + 1);
    }

    prevStep() {
        return this.goToStep(this.state.stepIndex -1);
    }

    goToStep(index) {
        if (index > this.state.lastStep && index > -1) {
            throw new Error(
                `Index must be between 0 and ${this.state
                    .lastStep} (including).`
            );
        }

        this.updateStateForStep(index);
    }

    renderVerticalStepActions = stepIndex => {
        const { submitting } = this.props;
        return (
            <div style={{ margin: "12px 0" }}>
                {stepIndex < this.props.sections.length - 1 &&
                    <Button
                        label="Continue"
                        primary={true}
                        onTouchTap={this.nextStep}
                    />}
                {this.state.stepIndex === this.props.sections.length - 1 &&
                    <Button
                        icon={submitting ? <Spinner inButton /> : null}
                        type="submit"
                        primary
                        disabled={submitting}
                        label={!submitting ? "Finish" : null}
                    />}
                {stepIndex > 0 &&
                    <FlatButton
                        label="Back"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.prevStep}
                    />}
            </div>
        );
    };

    renderStepActions(stepIndex) {
        const { submitting } = this.props;
        return (
            <div style={{ padding: "16px 0", position: "relative" }}>
                {stepIndex > 0 &&
                    <Button
                        style={styles.backButton}
                        label="Back"
                        primary={true}
                        onTouchTap={this.prevStep}
                    />}
                {stepIndex < this.props.sections.length - 1 &&
                    <Button
                        style={styles.nextButton}
                        label="Continue"
                        primary={true}
                        onTouchTap={this.nextStep}
                    />}
                {this.state.stepIndex === this.props.sections.length - 1 &&
                    <Button
                        style={styles.nextButton}
                        icon={submitting ? <Spinner inButton /> : null}
                        type="submit"
                        primary
                        disabled={submitting}
                        label={!submitting ? "Finish" : null}
                    />}
            </div>
        );
    }

    renderSteps = currStepErrors => {
        const vertical = this.shouldRenderVertical();
        const { stepIndex } = this.state;

        return this.props.sections.map((section, i) => {
            const sectionName = this.getSectionName(i);
            const showError =
                (i < this.state.stepIndex ||
                    this.state.visited.indexOf(i) > -1 ||
                    _max(this.state.visited) > i) &&
                this.props.errorState &&
                hasError(this.props.errorState[sectionName]);
            const sectionDisplayName =
                sectionName.charAt(0).toUpperCase() +
                this.getSectionName(i).slice(1);
            return vertical
                ? <Step
                      key={sectionName}
                      completed={this.state.completed.indexOf(i) > -1}
                  >
                      <StepLabel
                          onClick={() => this.goToStep(i)}
                          {...section.props.icon && {
                              icon: section.props.icon
                          }}
                          {...showError && { icon: sectionErrorIcon }}
                      >
                          {sectionDisplayName}
                      </StepLabel>
                      <StepContent>
                          {React.cloneElement(this.props.sections[stepIndex], {
                              errors: currStepErrors
                          })}
                          {this.renderVerticalStepActions(stepIndex)}
                      </StepContent>
                  </Step>
                : <Step
                      key={sectionName}
                      completed={this.state.completed.indexOf(i) > -1}
                  >
                      <StepButton
                          onClick={() => this.goToStep(i)}
                          {...section.props.icon && {
                              icon: section.props.icon
                          }}
                          {...showError && { icon: sectionErrorIcon }}
                      >
                          {sectionDisplayName}
                      </StepButton>
                  </Step>;
        });
    };

    shouldRenderVertical = () => {
        return (
            this.props.orientation === "vertical" ||
            (this.props.responsive &&
                window.matchMedia("(max-width: 550px)").matches)
        );
    };

    render() {
        const {
            handleSubmit,
            submitted,
            submitFailed,
            pristine,
            error,
            invalid,
            valid,
            reset,
            dirty,
            submitting
        } = this.props;
        const { stepIndex } = this.state;
        const vertical = this.shouldRenderVertical();
        const currStepErrors = this.props.errorState
            ? this.props.errorState[this.getSectionName(stepIndex)]
            : {};

        const steps = this.props.stepsRender
            ? this.props.stepsRender(this.props, this.state)
            : this.renderSteps(currStepErrors);

        return (
            <form onSubmit={handleSubmit}>
                <Stepper
                    activeStep={stepIndex}
                    orientation={
                        this.shouldRenderVertical() ? "vertical" : "horizontal"
                    }
                    linear={this.props.stepperLinear}
                >
                    {steps}
                </Stepper>

                {!vertical &&
                    <AnimateHeight height={this.state.sectionHeight}>
                        {React.cloneElement(this.props.sections[stepIndex], {
                            errors: currStepErrors
                        })}
                    </AnimateHeight>}
                {submitFailed &&
                    error &&
                    stepIndex == this.props.sections.length - 1 &&
                    <p style={{ color: red500 }}>
                        {error}
                    </p>}

                {this.props.renderContent
                    ? this.props.renderContent(this.props, this.state)
                    : !vertical ? this.renderStepActions(stepIndex) : null}

                {this.props.children}
            </form>
        );
    }
}
FormStepper.propTypes = {
    /**
     * The name of the form in the redux-store.
     */
    form: PropTypes.string.isRequired,
    stepperLinear: PropTypes.bool,

    /**
     * An array of sections, each section should be a react-node
     * Each section should render a FormSection, and MUST have a "name"-prop.
     * Sections can provide these additional props:
     *    icon - the icon to be rendered in the stepper for this section.
     * Each section is rendered in the order they are provided, and gets the following props when rendered:
     *    errors - the errorState of the section.
     */
    sections: PropTypes.arrayOf(PropTypes.node).isRequired,

    /**
     * Function called with values of the form when it's submitted.
     * onSubmit(values)
     */
    onSubmit: PropTypes.func.isRequired,
    /**
     * Override the content, next-buttons etc, called with the entire state and props of the FormStepper
     * Mostly useful for horizontal-orientation to override the default next-buttons, where you have
     * access to the state of the stepper.
     *  renderContent(stepperProps, stepperState)
     */
    renderContent: PropTypes.func,

    /**
     * Override the steps, a function which should return an array of Steps (material-ui react-nodes)
     * The function is called with the props and state of the FormStepper.
     * stepsRender(props, state)
     */
    stepsRender: PropTypes.func,

    orientation: PropTypes.oneOf(["vertical", "horizontal"]),

    /**
     * Renders a vertical-stepper if the viewport is narrow (<550px).
     */
    responsive: PropTypes.bool
    /**
     * See http://redux-form.com/7.0.3/docs/api/ReduxForm.md/
     * for other props that may be passed to the form
     */
};

FormStepper.defaultProps = {
    stepperLinear: false,
    orientation: "horizontal"
};

const mapStateToProps = (state, ownProps) => ({
    errorState: getFormSyncErrors(ownProps.form)(state)
});
const ReduxFormConnected = reduxForm({})(FormStepper);
export default connect(mapStateToProps)(ReduxFormConnected);
