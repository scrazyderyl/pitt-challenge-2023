import React from 'react'

interface Props {
    value: number;
}

function LevelIndicator(props: Props) {
    const colors = ["antiquewhite", "darkseagreen", "cadetblue", "salmon"]

    return (
        <div className="level-indicator" style={{backgroundColor: colors[props.value - 1]}}>{props.value}</div>
    )
}

export default LevelIndicator;