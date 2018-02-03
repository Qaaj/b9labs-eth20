import React from 'react';
import {Input} from 'semantic-ui-react';
import styled from 'styled-components';
import BaseModal from '../modals/BaseModal';

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

class RequestLinkPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addNewLinkURL: '',
      isAddExtraDataChecked: false,
    }
  }

  componentDidMount() {

  }

  render() {
    return  (
        <BaseModal isOpen={this.props.isOpen}
                   title="Add Your Video To The Queue!"
                   onCloseClick={this.props.onCloseClick}
                   onConfirmClick={() => this.props.onSendClickedHandler(this.state)}>
          <div>
          <p>Show your video to the world by sending a small transaction to</p>

        <FormContainer>
          <Column>
            <label htmlFor="input">YouTube URL</label>
            <Input size="big" name="input" type="text" placeholder="https://www.youtube.com/watch?v=jlNvOWDfMYo" onChange={(evt) => this.setState({ addNewLinkURL: evt.target.value })} />
          </Column>

          <br />

          <Row>
            <label htmlFor="chkAddData">I want to add extra data</label>
            <input type="checkbox" id="chkAddData" name="chkAddData" title="tst" value={this.state.isAddExtraDataChecked} onChange={() => this.setState({ isAddExtraDataChecked: !this.state.isAddExtraDataChecked })} />
          </Row>
        </FormContainer>
      </div>
        </BaseModal>
    );
  }
}

RequestLinkPanel.defaultProps = {};
RequestLinkPanel.propTypes    = {};

export default RequestLinkPanel;
