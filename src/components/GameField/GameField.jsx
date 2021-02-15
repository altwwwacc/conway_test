import React from 'react';
import classnames from "classnames";


const GameField = ({x = 10,y = 10, map, onItemClick}) => {
    const xArr = new Array(x).fill();
    return (
        <div className="GameField">
            {new Array(y).fill().map((yData, yIndex) => (
                <div className="Game__row" key={`Game__row-${yIndex}`}>
                    {xArr.map((xData, xIndex) => {
                        const [xId, yId] = [xIndex + 1 ,yIndex + 1];

                        if(map[`${xId}|${yId}`] === undefined) {
                            map[`${xId}|${yId}`] = false;
                        }

                        return (
                            <div
                                className={classnames(`Game__item Game__item--x-${xId} Game__item--y-${yId}`, {
                                    'Game__item--live': map[`${xId}|${yId}`]
                                })}
                                key={`Game__item-${xId}|${yId}`}
                                onClick={onItemClick(`${xId}|${yId}`)}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    );
};


export default GameField;