import React, {useState, useEffect, useRef} from "react";
import {useParams} from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function CodeBlock() {
    const { id } = useParams();
    const codeBlocks = ['Async task', 'Sync task', 'React task', 'Node task'];
    const [code, setCode] = useState("Loading code...");
    const [title, setTitle] = useState('Async task');

    const [codeReceived, setCodeReceived] = useState(code);
    const [titleReceived, setTitleReceived] = useState(title);

    const [mentor, setMentor] = useState(true);
    const codeRef = useRef(null);

    const updateCode = (event) => {
        setCode(event.target.innerText);
        socket.emit(`send_code_${id}`, { code });
    }

    useEffect(() => {
        socket.emit(`connect_${id}`, `${id}`);

        socket.on("user_counter", (data) => {
            setMentor(data == 2);
        });

        socket.on(`init_${id}`, (data) => {
            setCodeReceived(data.code);
            setTitleReceived(data.title);
        });

        socket.on(`receive_code_${id}`, (data) => {
            setCodeReceived(data.code);
            setTitleReceived(data.title);
        })}, [socket]);

    return (
        <div>
            
            { titleReceived ? <h1>{titleReceived}</h1> : <h1>{codeBlocks[id - 1]}</h1> }
            {mentor ? <h3>Mentor</h3> : <h3>Student</h3>}
            <pre>
                <code 
                    className="javascript" ref={codeRef} 
                    contentEditable={!mentor} onInput={updateCode}>
                  {codeReceived}
                </code>
            </pre>
        </div>
    );
}

export default CodeBlock;