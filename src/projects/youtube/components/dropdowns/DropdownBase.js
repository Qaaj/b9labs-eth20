import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownBase = ({placeholder, options, style, onChange}) => (
    <Dropdown button
              color="red"
              style={style}
              text={placeholder}
              options={options}
              onChange={onChange} />
)

export default DropdownBase;
