import React from 'react';
import PropTypes from 'prop-types';
//import styled from 'styled-components';
import ReactPlayer from 'react-player';


class YouTubeComponent extends React.Component{

  _onReady = (event) => {
    console.log(event.target)
  };

  render(){
    const { url, videoPlayer } = this.props;
    const { width, height } = videoPlayer;


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
                        style={this.props.style}
                        playing={true}
                        width={width}
                        height={height}
                        onError={(err) => console.log('Error: ' , err)}
                        config={{
                          youtube: {
                            playerVars: {
                              showInfo: 0,
                              rel: 0,
                              modestbranding: 1,
                              loop: 1,
                              iv_load_policy: 0,
                              disablekb: 1,
                              controls: 0,
                            },
                          },
                          soundcloud: {
                            options:{
                              title: false
                            },
                          },
                          dailymotion: {
                          },
                          wistia: {
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
