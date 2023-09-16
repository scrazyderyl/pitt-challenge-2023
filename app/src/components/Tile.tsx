import { useState } from 'react';

import TaskAlert from './TaskAlert';

interface Props {
    id: string;
    name: string;
    icon_url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function Tile(props: Props) {
    const [alert, setAlert] = useState(" ");

    return (
        <div className="tile">
            {alert && <TaskAlert />}
            <img src={props.icon_url} width={props.width} height={props.height}></img>
        </div>
    );
}

export default Tile;