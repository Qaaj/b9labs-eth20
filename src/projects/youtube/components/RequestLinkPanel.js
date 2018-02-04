import React from 'react';
import {Form, Input, Message, TextArea} from 'semantic-ui-react';
import styled from 'styled-components';
import BaseModal from './modals/BaseModal';


const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const ModalContainer = styled(BaseModal)`
  p{
    color: black;
  }
`;

class RequestLinkPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormSuccess: true,
      errorMessages: [],

      addNewLinkURL: '',
      message: '',
    }
  }

  validateInput = (input) => {
    let result = false;

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    // If input is long enough
    if(input && input.length > 5){
      // Check if it's a valid url
      // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
      if (input.match(regex)) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  };

  onSubmitForm = () => {
    this.setState({
      isFormValid: false,
      errorMessages: []
    });


    if(this.validateInput(this.state.addNewLinkURL)){
      this.setState({
        isFormValid: true,
        errorMessages: []
      });

      console.log({url: this.state.addNewLinkURL, message: this.state.message})

      this.props.onSendClickedHandler({url: this.state.addNewLinkURL, message: this.state.message})
    }else{
      this.setState({
        isFormValid: false,
        errorMessages: ['That\s not a valid URL.']
      })
    }
  };

  render() {
    return  (
        <ModalContainer isOpen={this.props.isOpen}
                     title="Add Your Video To The Queue!"
                     onCloseClick={this.props.onCloseClick}
                     onConfirmClick={() => this.onSubmitForm()}>
          <div>
          <p>Show your video to the world by sending a small transaction to</p>

        <FormContainer success={this.state.errorMessages.length === 0 && this.state.isFormValid} error={this.state.errorMessages.length > 0}>
          <Form.Field required>
          <Column>
            <label htmlFor="input">YouTube URL</label>
            <Input size="big" name="input" type="text" placeholder="https://www.youtube.com/watch?v=jlNvOWDfMYo" onChange={(evt) => this.setState({ addNewLinkURL: evt.target.value })} />
          </Column>
          </Form.Field>

          <br />

          <Form.Field>
          <Column>
            <label htmlFor="chkAddData">Message (optional)</label>
            <TextArea placeholder="Add your message" id="message" name="message" value={this.state.message} onChange={(evt) => this.setState({ message: evt.target.value })} />
          </Column>
          </Form.Field>

          <Message
              error
              header='An error occured'
              list={this.state.errorMessages}
          />
        </FormContainer>
      </div>
        </ModalContainer>
    );
  }
}

RequestLinkPanel.defaultProps = {};
RequestLinkPanel.propTypes    = {};

export default RequestLinkPanel;
