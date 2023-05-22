import React, {Fragment, useState} from 'react';

function Square({value, onSquareClick, squareStyle}){

    return (
        <button className="square" onClick={onSquareClick} style={squareStyle}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay}){
    
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
    else
        status= 'Next player: ' + (xIsNext ? 'X' : 'O');

    return (
        <Fragment>
            <div className='status'>{status}</div>

            <div className="board-row">
                <Square squareStyle={winner && winner.line.includes(0) ? {color:'red'} : {}}
                    value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square squareStyle={winner && winner.line.includes(1) ? {color:'red'} : {}} 
                    value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square squareStyle={winner && winner.line.includes(2) ? {color:'red'} : {}}
                    value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="board-row">
                <Square squareStyle={winner && winner.line.includes(3) ? {color:'red'} : {}}
                    value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square squareStyle={winner && winner.line.includes(4) ? {color:'red'} : {}}
                    value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square squareStyle={winner && winner.line.includes(5) ? {color:'red'} : {}}
                    value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="board-row">
                <Square squareStyle={winner && winner.line.includes(6) ? {color:'red'} : {}}
                    value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square squareStyle={winner && winner.line.includes(7) ? {color:'red'} : {}}
                    value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square squareStyle={winner && winner.line.includes(8) ? {color:'red'} : {}}
                    value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
        </Fragment>
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

    function handlePlay(nextSquares, position){
        const nextHistory= [...history.slice(0, currentMove+1), {
            squares: nextSquares,
            position
        }];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length-1);
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
                        <p style={{fontWeight:'bold'}}>You are at {description}</p>
                    :
                    <button className='history-item' onClick={() => jumpTo(move)}>
                        Go to {description}
                    </button>
                }                 
            </li>
        );
    });

    return (
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className='game-info'>
                <ol>
                    {moves}
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
