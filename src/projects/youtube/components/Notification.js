import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;


const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled(Column)`
  background-color: white;
  width: 350px;
  padding: 1em;
`;

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (<Container>
      <Row>
        <h1>{this.props.title}</h1>
        <button style={{ width: '50px', height: '50px'}} onClick={() => this.props.onClose(this.props.id)}>Close</button>
      </Row>


      <p>{this.props.message}</p>
    </Container>);
  }
}

Notification.defaultProps = {};
Notification.propTypes    = {};

export default Notification;
