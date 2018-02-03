import React from 'react';
import PropTypes from 'prop-types';
//import styled from 'styled-components';
import ReactPlayer from 'react-player';


class YouTubeComponent extends React.Component{

  _onReady = (event) => {
    console.log(event.target)
  };

  render(){
    const { width, height, url } = this.props.videoPlayer;

    /**const opts = {
      height,
      width,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        showinfo: 0,
        loop: 1,
        iv_load_policy: 3,
        fs: 0,
        rel: 0,
        controls: 0,
      }
    };**/

    return <ReactPlayer url={url}
                        playing={true}
                        width={width}
                        height={height}
                        config={{
                          youtube: {
                            playerVars: {
                              showInfo: 0,
                            }
                          },
                          soundcloud: {

                          }
                        }}
    />;
  }
}

YouTubeComponent.defaultProps = {};
YouTubeComponent.propTypes    = {
  videoPlayer: PropTypes.object.isRequired,
};

export default YouTubeComponent;
