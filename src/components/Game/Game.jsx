import React, { Component } from 'react';
import classnames from 'classnames';
import GameField from './../GameField/GameField';

import './Game.scss';


const DEFAULT_SETTING = {
    x: 10,
    y: 10,
};
const shapes = {
    glider: ['3|4', '4|5', '5|3', '5|4', '5|5'],
};
const getShapeByName = (shapeName) => {
    if(!shapes[shapeName]) {
        alert('sorry this shape not created');
        return {};
    }
    return shapes[shapeName].reduce((res, item) => ({...res, [item]: true}), {});
};

const generateField= ({x = DEFAULT_SETTING.x ,y = DEFAULT_SETTING.y, shapeName = 'glider', shape}) => {

    const xArr = new Array(x).fill();
    let mapDefault = {};

    new Array(y).fill().map((yData, yIndex) => {
        xArr.map((xData, xIndex) => {
            const [xId, yId] = [xIndex + 1 ,yIndex + 1];
            mapDefault[`${xId}|${yId}`] = false;
        })
    });

    const shapeMap = shape || getShapeByName(shapeName);
    return {
        mapDefault,
        map: {...mapDefault, ...shapeMap },
        mapKeys: Object.keys(mapDefault),
    }
};



class Game extends Component {

    constructor(props) {
        super(props);
        const { map, mapKeys } = generateField({});
        this.state = {
            ...DEFAULT_SETTING,
            map,
            mapKeys,
            started: false,
            shape: null,
            shapeName: null,
        };
        this.mapHistory = new Set();
    }

    start = () => {
        const { x, y } = this.state;
        const { map, mapKeys } = generateField({x, y, shape: this.state.map});
        this.setState({
            map,
            mapKeys,
            started: true
        });
        this.interval = setInterval(this.nextTick, 1000);

    };
    stop = () => {
        this.setState({
            started: false,
        });
        clearInterval(this.interval);
    };
    reset = () => {
        this.stop();
        const { map, mapKeys } = generateField({});
        this.setState({
            ...DEFAULT_SETTING,
            map,
            mapKeys,
            shape: null,
            shapeName: null,
        })
    };

    setFieldSize = (axis) => (e) => {
        const value = parseInt(e.target.value);
        if(e.target.value.length && isNaN(value)) {
            alert('Please type only digits');
        }
        this.setState({
            [axis]: (!e.target.value.length) ? DEFAULT_SETTING[axis] : value
        })
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    isFinishScenario = (newMap) => {
        const noAliveItems = Object.values(newMap).filter(i => i).length === 0;
        const fieldRepeat = this.mapHistory.has(JSON.stringify(newMap));

        return noAliveItems || fieldRepeat;
    };

    nextTick = () => {
        const {  mapKeys } = this.state;

        const newMap = {};
        mapKeys.forEach(mapItem => newMap[mapItem] = this.checkItemStatus(mapItem));

        if(this.isFinishScenario(newMap)) {
            alert('the end');
            this.stop();
            return
        }
        this.mapHistory.add(JSON.stringify(newMap));
        this.setState({
            map: newMap,
        })
    };

    checkItemStatus = (mapItem) => {
        const { map } = this.state;
        const [xString, yString] = mapItem.split('|');
        const x = parseInt(xString);
        const y = parseInt(yString);

        const values = [
            map[`${ x - 1 }|${ y + 1 }`],
            map[`${ x }|${ y + 1}`],
            map[`${ x + 1 }|${ y + 1}`],
            map[`${ x + 1 }|${ y }`],
            map[`${ x + 1 }|${ y - 1}`],
            map[`${ x }|${ y - 1}`],
            map[`${ x - 1}|${ y - 1}`],
            map[`${ x - 1}|${ y }`],
        ].filter(i => i);

        const aliveItemsLength = values.length;
        const itemIsLive = map[mapItem];

        return (aliveItemsLength === 3 && !itemIsLive) || (itemIsLive && (aliveItemsLength === 2 || aliveItemsLength=== 3));
    };

    onItemClick = (itemKey) => () => {
        const { started } = this.state;
        if(started) return;

        const { map } = this.state;

        this.setState({
            map: {
                ...map,
                [itemKey]: !map[itemKey]
            }
        })
    };
    render() {
        const { map, x, y, started} = this.state;

        return (
            <div className="Game">
                <div className="Game__field">
                    <GameField map={map} x={x} y={y} onItemClick={this.onItemClick}/>
                </div>

                <div className="Game__settings">
                    <div>
                        {!started && (
                            <button onClick={this.start}>
                                Start
                            </button>
                        )}
                        {started && (
                            <button onClick={this.stop}>
                                Stop
                            </button>
                        )}

                    </div>
                    <div>
                        <span>Field size</span>
                        <input type="text"  onChange={this.setFieldSize('x')} placeholder="X (default: 10)"/>
                        <input type="text"  onChange={this.setFieldSize('y')} placeholder="Y (default: 10)"/>
                    </div>
                    <div>
                        <button onClick={this.reset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


export default Game;