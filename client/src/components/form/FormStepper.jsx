import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Card, CardText } from 'material-ui/Card'
import Button from 'material-ui/RaisedButton'
import { reduxForm, getFormSyncErrors } from 'redux-form'
import Spinner from '../utils/Spinner'
import Stepper from 'material-ui/Stepper/Stepper'
import Step from 'material-ui/Stepper/Step'
import StepButton from 'material-ui/Stepper/StepButton'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { red500 } from 'material-ui/styles/colors'
import _max from 'lodash/max'
import AnimateHeight from 'react-animate-height'
import { hasError } from './ReduxFormUtils'

const sectionErrorIcon = <WarningIcon color={red500} />

/**
 * A general component that helps rendering a stepper with
 * multiple sections powered by redux-form.
 * All stepper-state and logic is encapsulated in this component.
 *
 * All validation is done through redux-form.
 */

class FormStepper extends Component {
    constructor(props) {
        super(props)

        this.state = {
            stepIndex: 0,
            completed: [],
            visited: [],
            sectionHeight: 'auto',
        }

        this.getSectionName = this.getSectionName.bind(this)
        this.updateStateForStep = this.updateStateForStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.prevStep = this.prevStep.bind(this)
        this.goToStep = this.goToStep.bind(this)
    }

    getSectionName(id) {
        return this.props.sections[id].props.name
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.sectionHeight !== 'auto') {
            this.setState({
                ...this.state,
                sectionHeight: 'auto',
            })
        }
    }

    updateStateForStep(nextStep) {
        const currStep = this.state.stepIndex
        if (currStep == nextStep) return
        const currSection = this.getSectionName(currStep)
        const errorFields = this.props.errorState[currSection]
        const completedWithoutCurrent = this.state.completed.filter(
            step => step !== currStep
        )
        this.setState({
            ...this.state,
            stepIndex: nextStep,
            completed: hasError(errorFields)
                ? completedWithoutCurrent
                : completedWithoutCurrent.concat(currStep),
            visited: this.state.visited.concat(currStep),
            sectionHeight: 0,
        })
    }

    nextStep() {
        const currStep = this.state.stepIndex
        const currSection = this.getSectionName(currStep)
        const errorFields = this.props.errorState[currSection]
        const errorFieldNames = Object.keys(errorFields).map(
            (field, i) => `${currSection}.${field}`
        )
        //Touch all fields that has an error, so that the fields are updated to show the error
        //and prevent transition
        if (errorFieldNames.length > 0) {
            this.props.touch(...errorFieldNames)
            return
        }

        this.updateStateForStep(currStep + 1)
    }

    prevStep() {
        let currStep = this.state.stepIndex
        this.setState({
            ...this.state,
            stepIndex: currStep > 0 ? --currStep : 0,
        })
    }

    goToStep(index) {
        if (index > this.state.lastStep && index > -1) {
            throw new Error(
                `Index must be between 0 and ${this.state.lastStep} (including).`
            )
        }

        this.updateStateForStep(index)
    }

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
            submitting,
        } = this.props

        const { stepIndex } = this.state
        const styles = {
            nextButton: {
                position: 'absolute',
                right: 0,
            },
            backButton: {
                position: 'absolute',
                left: 0,
            },
        }

        const currStepErrors = this.props.errorState
            ? this.props.errorState[this.getSectionName(stepIndex)]
            : {}

        const steps = this.props.stepsRender
            ? this.props.stepsRender({ ...this.props, ...this.state })
            : this.props.sections.map((section, i) => {
                  const sectionName = this.getSectionName(i)
                  const showError =
                      (i < this.state.stepIndex ||
                          this.state.visited.indexOf(i) > -1 ||
                          _max(this.state.visited) > i) &&
                      this.props.errorState &&
                      hasError(this.props.errorState[sectionName])
                  const sectionDisplayName =
                      sectionName.charAt(0).toUpperCase() +
                      this.getSectionName(i).slice(1)
                  return (
                      <Step
                          key={sectionName}
                          completed={this.state.completed.indexOf(i) > -1}
                      >
                          <StepButton
                              onClick={() => this.goToStep(i)}
                              {...(section.props.icon && {
                                  icon: sections.props.icon,
                              })}
                              {...(showError && { icon: sectionErrorIcon })}
                          >
                              {sectionDisplayName}
                          </StepButton>
                      </Step>
                  )
              })

        return (
            <form onSubmit={handleSubmit}>
                <Stepper
                    activeStep={stepIndex}
                    linear={this.props.stepperLinear}
                >
                    {steps}
                </Stepper>

                <AnimateHeight height={this.state.sectionHeight}>
                    {React.cloneElement(this.props.sections[stepIndex], {
                        errors: currStepErrors,
                    })}
                </AnimateHeight>

                {submitFailed &&
                    error &&
                    stepIndex == this.props.sections.length - 1 && (
                        <p style={{ color: red500 }}>{error}</p>
                    )}

                {this.props.content ? (
                    React.cloneElement(this.props.content, {
                        stepperState: this.state,
                        stepperProps: this.props,
                    })
                ) : (
                    <div style={{ padding: '16px 0', position: 'relative' }}>
                        {stepIndex > 0 && (
                            <Button
                                style={styles.backButton}
                                label="Back"
                                primary={true}
                                onClick={this.prevStep}
                            />
                        )}
                        {stepIndex < this.props.sections.length - 1 && (
                            <Button
                                style={styles.nextButton}
                                label="Continue"
                                primary={true}
                                onClick={this.nextStep}
                            />
                        )}
                        {this.state.stepIndex ===
                            this.props.sections.length - 1 && (
                            <Button
                                style={styles.nextButton}
                                icon={submitting ? <Spinner inButton /> : null}
                                type="submit"
                                primary
                                disabled={submitting}
                                label={!submitting ? 'Finish' : null}
                            />
                        )}
                    </div>
                )}
                {this.props.children}
            </form>
        )
    }
}
FormStepper.propTypes = {
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
     * Override the content, next-buttons etc, this gets the entire state and props of the Stepper
     *  props: stepperState, stepperProps
     */
    content: PropTypes.node,

    /**
     * Override the steps, a function which should return an array of Steps (react-nodes)
     * The function is called with the props of the stepper with the state shallowly merged in.
     * stepsRender(props)
     */
    stepsRender: PropTypes.func,

    /**
     * See http://redux-form.com/7.0.3/docs/api/ReduxForm.md/
     * for other props that may be passed to the form
     */
}

FormStepper.defaultProps = {
    stepperLinear: false,
}

const mapStateToProps = (state, ownProps) => ({
    errorState: getFormSyncErrors(ownProps.form)(state),
})
const ReduxFormConnected = reduxForm({})(FormStepper)
export default connect(mapStateToProps)(ReduxFormConnected)
