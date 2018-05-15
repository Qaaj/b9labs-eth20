import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Modal} from 'semantic-ui-react';

class BaseModal extends React.Component {

  renderButtonBar = (actions) => {
    let buttons = actions.map(({key, color, onClick, icon, label}) => {
      return (
          <Button key={key} color={color} onClick={onClick} inverted>
            <Icon name={icon} /> {label}
          </Button>
      )
    });

    return (<Modal.Actions>
        { buttons }
    </Modal.Actions>)
  };

  render() {
    let { actions } = this.props;

    if(!actions){
      actions = [
        {
          key: 'btn-cancel',
          color: 'red',
          icon: 'cancel',
          label: 'CANCEL',
          onClick: () => this.props.onClose(),
        },

        {
          key: 'btn-confirm',
          color: 'green',
          icon: 'checkmark',
          label: 'CONFIRM',
          onClick: () => this.props.onConfirm(),
        }
      ]
    }

    return <Modal 	 closeIcon={true}
                     open={this.props.isOpen}
                     closeOnDimmerClick={true}
                     closeOnEscape={true}
                     closeOnRootNodeClick={true}
                     onClose={() => this.props.onClose()}>
      <Modal.Header>{this.props.title}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          { this.props.children }
        </Modal.Description>
      </Modal.Content>

      { this.renderButtonBar(actions) }
    </Modal>;
  }
}

BaseModal.defaultProps = {};
BaseModal.propTypes    = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,

  actions: PropTypes.array,
};

export default BaseModal;
