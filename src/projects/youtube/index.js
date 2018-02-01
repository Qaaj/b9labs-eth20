import React from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '../../styles/index';
import styled from 'styled-components';
import { requestNewVideo, requestCurrentVideo } from './reducer';

const Input = styled.input`
  border-radius: 3px;
  height: 25px;
  font-size: 18px;
  width: 200px;
  margin-right: 10px;
`;

const PlayerHolder = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class Youtube extends React.PureComponent {

  state = {};

  constructor(props) {
    super(props);
    props.requestCurrentVideo(props.contract, props.accounts);
  }

  render() {
    const { props } = this;
    return (<div>
      <h2>Youtube</h2>
      <Input onChange={(e) => this.setState({ URL: e.target.value })} />
      <Button onClick={() => props.requestNewVideo(this.state.URL, '', props.contract, props.accounts)}> Set
        URL</Button>
      <Button onClick={() => props.requestCurrentVideo(props.contract)}> Get the URL </Button>
      <p>{props.url ? `Latest URL: ${props.url}` : 'No URL set!'}</p>
      <PlayerHolder>
        <ReactPlayer url={props.url}
                     playing={true}
                     width={800}
                     height={450}
                     config={{ youtube: { playerVars: { showInfo: 0, } } }}
        />
      </PlayerHolder>
    </div>);

  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube', 'contract']),
    accounts: state.settings.get('accounts'),
    url: state.youtube.getIn(['latestVideo', 'url']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url, message, contract, accounts) => dispatch(requestNewVideo(url, message, contract, accounts)),
    requestCurrentVideo: (contract) => dispatch(requestCurrentVideo(contract)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

