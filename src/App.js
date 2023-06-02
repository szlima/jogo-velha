import React, {Fragment, useState} from 'react';

function Square({value, onSquareClick, squareStyle, marginClass}){

    return (
        <button className={`square ${marginClass}`} onClick={onSquareClick} style={squareStyle}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay, noMoreMoves}){
    
    function handleClick(i){

        if(calculateWinner(squares) || squares[i])
            return;

        const nextSquares= squares.slice();

        if(xIsNext)
            nextSquares[i]= 'X';
        else
            nextSquares[i]= 'O';

        const position= {
            row: Math.floor(i/3),
            col: i%3
        };

        onPlay(nextSquares, position);
    }

    const winner= calculateWinner(squares);
    let status;
    if(winner)
        status= 'Winner: ' + winner.player;
    else if(noMoreMoves)
        status= 'Draw!';
    else
        status= 'Next player: ' + (xIsNext ? 'X' : 'O');

    function renderSquare(i){

        let marginClass= "";

        if(i%3 !== 0)
            marginClass+= " margin-left";
        if(i%3 !== 2)
            marginClass+= " margin-right";
        if(Math.floor(i/3) !== 0)
            marginClass+= " margin-top";
        if(Math.floor(i/3) !== 2)
            marginClass+= " margin-bottom";

        return <Square marginClass={marginClass}
                    squareStyle={winner && winner.line.includes(i) ? {color:'red'} : {}}
                    value={squares[i]} onSquareClick={() => handleClick(i)} key={`square${i}`}
                />;
    }

    let k=0;
    let boardRows= [];
    for(let i=0; i<3; i++){

        let positions= [];
        for(let j=0; j<3; j++){
            positions.push(renderSquare(k));
            k++;
        }
        boardRows.push(
            <div className="board-row" key={`row${i}`}>
                {positions}
            </div>
        );
    }

    return (
        <Fragment>
            <div className='status'>{status}</div>
            {boardRows}
        </Fragment>
    );
}

function InputOrder({value, checked, onChange}){

    return (
        <div className='sorting-option'>
            <input type='radio' name='order'
                id={value} value={value} checked={checked} onChange={onChange}/>
            <label htmlFor={value}>
                 {value.slice(0,1).toUpperCase() + value.slice(1)}
            </label>
        </div>
    );
}

export default function Game(){
    const [history, setHistory]= useState([{
        squares: Array(9).fill(null),
        position: null
    }]);
    const [currentMove, setCurrentMove]= useState(0);
    const xIsNext= currentMove%2 === 0;
    const currentSquares= history[currentMove].squares;
    const [ascendingMoves, setAscendingMoves]= useState(true);

    function handlePlay(nextSquares, position){
        const nextHistory= [...history.slice(0, currentMove+1), {
            squares: nextSquares,
            position
        }];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length-1);
    }

    function handleToggleOrder(ascendingOrder){
        setAscendingMoves(ascendingOrder);
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
    }

    const moves= history.map((step, move) => {
        let description;

        if(move > 0)
            description= 'move #' + move +
                ' | Played at (' + step.position.row +
                ',' + step.position.col + ')';
        else
            description= 'game start';

        return (
            <li key={move}>
                {
                    move === currentMove ? 
                        <p className='history-item bg-info'>You are at {description}</p>
                    :
                    <button className='history-item btn btn-outline-info' onClick={() => jumpTo(move)}>
                        Go to {description}
                    </button>
                }                 
            </li>
        );
    });

    return (
        <div className='game'>
            <h1>Tic-Tac-Toe</h1>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} noMoreMoves={currentMove === 9}/>
            </div>
            <div className='game-info'>
                <div className='sorting'>
                    <InputOrder value='ascending' checked={ascendingMoves} onChange={() => handleToggleOrder(true)}/>
                    <InputOrder value='descending' checked={!ascendingMoves} onChange={() => handleToggleOrder(false)}/>
                </div>

                <ol>
                    {ascendingMoves ?
                        moves :
                        moves.map((move, i, array) => array[array.length-1-i])
                    }
                </ol>
            </div>
        </div>
    );
}

function calculateWinner(squares){

    const lines= [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for(let i=0; i<lines.length; i++){
        const [a,b,c]= lines[i];

        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return {
                player: squares[a],
                line: lines[i]
            };
    }
    return null;
}

/*
No React, é convencional usar nomes 
onSomething para props que representam eventos e 
handleSomething para as definições das funções que lidam com esses eventos.
*/
