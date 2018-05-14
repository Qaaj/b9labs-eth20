import React from 'react';
import {Form, Input, Message, TextArea} from 'semantic-ui-react';
import styled from 'styled-components';
import BaseModal from './modals/BaseModal';
import { Row, Column } from '../styles';

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
                     title="Show Your Video To The World!"
                     onClose={this.props.onCloseClick}
                     onConfirm={() => this.onSubmitForm()}>
          <div>

            <Row>
              <Column style={{ flex: 3}}>
                <h2>How does it work?</h2>
                <p>
                  Show your video to the world by sending an Ethereum transaction.<br />
                  Copy paste your video URL in the input field below and press confirm.<br /><br />
                  Your MetaMask/Mist wallet will pop-up, asking to submit the confirmation.<br /><br />

                  Your submitted video will be broadcasted as soon as the transaction is confirmed.<br /><br />
                </p>
              </Column>

              <Column style={{ flex: 2}}>
                <h2>What do we support?</h2>

                Wallets
                <ul>
                  <li>MetaMask, Mist, ...</li>
                </ul>

                Links
                <ul>
                  <li>YouTube, Twitch, Vimeo, Wistia</li>
                  <li>SoundCloud, Streamable, DailyMotion</li>
                  <li>Facebook/Twitter Live</li>
                  <li>DropBox files</li>
                </ul>
              </Column>
            </Row>

        <FormContainer success={this.state.errorMessages.length === 0 && this.state.isFormValid}
          error={this.state.errorMessages.length > 0}>
          <h2>Add Your Video</h2>

          <Form.Field required>
          <Column>
            <label htmlFor="input">Video URL</label>
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
