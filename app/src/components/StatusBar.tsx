import React from 'react'
import { useState } from 'react'

interface Props {
    XP: number;
    maxXP: number;
}

function StatusBar(props: Props) {
    return (
        <div className="status-bar" style={{backgroundSize: props.XP / props.maxXP * 100 + "%"}}>
            <p className="status-bar-text">{props.XP} / {props.maxXP} xp</p>
        </div>
    )
}

export default StatusBar;