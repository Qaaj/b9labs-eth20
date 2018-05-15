import React from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

const Blocky = ({ seed }) => {
  return (<Blockies
      seed={seed}
      size={10}
      scale={5}
      color="#dfe"
      bgColor="#ffe"
      spotColor="#abc"
  />);
};

Blocky.defaultProps = {};

Blocky.propTypes    = {
  seed: PropTypes.string.isRequired,
};

export default Blocky;
