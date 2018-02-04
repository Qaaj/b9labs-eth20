import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Modal} from 'semantic-ui-react';
import styled from 'styled-components';

class BaseModal extends React.Component {

  render() {
    return <Modal 	 closeIcon={true}
                     open={this.props.isOpen}
                     closeOnDimmerClick={true}
                     closeOnEscape={true}
                     closeOnRootNodeClick={true}
                     onClose={() => this.props.onCloseClick()}>
      <Modal.Header>{this.props.title}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          { this.props.children }
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button color="red" onClick={() => this.props.onCloseClick()} inverted>
          <Icon name='cancel' /> Cancel
        </Button>

        <Button color='green' onClick={this.props.onConfirmClick} inverted>
          <Icon name='checkmark' /> Submit
        </Button>
      </Modal.Actions>
    </Modal>;
  }
}

BaseModal.defaultProps = {};
BaseModal.propTypes    = {};

export default BaseModal;
