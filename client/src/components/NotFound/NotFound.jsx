import React, {useEffect} from "react";
import './NotFound.css';

function NotFound({set404}) {
    useEffect(() => {
        set404(true);
    }, []);

    return (
        <div className="NotFound">
            <p className="NotFoundTitle">404 Not found <span role="img">🏴‍☠</span></p>
            <p className="NotFoundDesc">Hey pirate, it seems you've beached on the wrong island.</p>
        </div>
    );
}

export default NotFound;
