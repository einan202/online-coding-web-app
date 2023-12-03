import React from "react";
import { Link } from 'react-router-dom';

const codeBlocks = ['Async case', 'Sync case', 'React case', 'Node case'];

function Lobby() {

    return (
      <div>
        <h1>Choose code block</h1>
        <ul>
            {codeBlocks.map((block, index) => (
              <li key={index}>
                <Link to={`/code-block/${index + 1}`}> {block} </Link>
              </li>
            ))}
        </ul>
      </div>
    );
}

export default Lobby;