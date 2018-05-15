import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

const YouTubeComponent = (props) => {
  const { url, videoPlayer } = props;
    const { width, height } = videoPlayer;

    // https://developers.google.com/youtube/player_parameters
    return (<div onClick={evt => evt.preventDefault()}>
        <ReactPlayer    url={url}
                        muted={true}
                        style={Object.assign(props.style, { pointerEvents: 'none' })}
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
                              //loop: 1,
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
        /></div>);
};

YouTubeComponent.defaultProps = {};
YouTubeComponent.propTypes    = {
  videoPlayer: PropTypes.object.isRequired,
};

export default YouTubeComponent;
