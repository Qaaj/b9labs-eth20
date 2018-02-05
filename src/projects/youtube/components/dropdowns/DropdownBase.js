import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownBase = ({placeholder, options, onChange, style}) => (
    <Dropdown button
              style={style}
              text={placeholder}
              options={options}
              onChange={onChange} />
)

export default DropdownBase;
