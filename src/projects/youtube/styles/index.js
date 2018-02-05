import styled from 'styled-components';
import { css } from 'styled-components'

/**
 *
 * CSS RESPONSIVENESS USING MEDIA TEMPLATES
 * Media Template
 * https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md
 * these sizes are arbitrary and you can set them to whatever you wish
 *
 **/
const sizes = {
  giant: 5000,
  desktop: 1600,
  tablet: 1024,
  phone: 800
};

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((accumulator, label) => {
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  accumulator[label] = (...args) => css`
		/** Everything smaller then defined width **/
    @media (max-width: ${emSize}em) {
      ${css(...args)}
    }
  `;
  return accumulator
}, {});




/**
 *
 * CSS STYLES HERE
 *
 **/

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const ButtonPrimary = styled.div`
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  background-color: yellow;
  color: black;
  max-width: 300px; 
  text-align: center;
  margin: 10px 5px;
  font-weight: bolder;
  text-transform: uppercase;
  
  cursor: pointer;
  cursor: hand;
`;

