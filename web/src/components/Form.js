import React, { Component }from 'react'
import { Button ,Form, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import TimeInput from 'react-time-input';
import * as ProphetApi from '../utils/ProphetApi'

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class LcForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expireDays: 1,
            startTime: '00:00'
        };
    }

    componentDidMount() {
        ProphetApi.loadconfig()
            .then((data) => {
                this.setState({expireDays: data.expiredays, startTime: data.starttime})
            })
    }

    handleExpiredChange = (event) => {
        this.setState({expireDays: event.target.value});
    }
    onTimeChangeHandler = (val) => {
        this.setState({startTime: val});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        ProphetApi.setconfig({
            expiredays: this.state.expireDays,
            starttime: this.state.startTime
        })
    }

    render () {
        return (
            <Form  style={{width:'40vw'}}>
                <FieldGroup
                    id="set expire days"
                    type="text"
                    label="set expire days for all objects"
                    placeholder="Enter number of days"
                    value={this.state.expireDays}
                    onChange={this.handleExpiredChange}
                />
                <FormGroup controlId="set clear time">
                    <ControlLabel>set when start to clear expired objects per day</ControlLabel>
                    <TimeInput
                        initTime={this.state.startTime}
                        ref="TimeInputWrapper"
                        className='form-control'
                        mountFocus='true'
                        onTimeChange={this.onTimeChangeHandler}
                    />
                </FormGroup>
                <Button type="submit" onClick={this.handleSubmit} style={{marginTop:'10px'}}>
                    Submit
                </Button>
            </Form>

        )
    }

}

export default LcForm