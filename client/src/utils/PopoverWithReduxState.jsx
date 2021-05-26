import React from 'react'
import { Provider, ReactReduxContext } from 'react-redux'
import Popover from 'material-ui/Popover'

export default function PopoverWithReduxState(props) {
    return (
        <ReactReduxContext.Consumer>
            {ctx => (
                <Popover {...props}>
                    <Provider store={ctx.store}>{props.children}</Provider>
                </Popover>
            )}
        </ReactReduxContext.Consumer>
    )
}
