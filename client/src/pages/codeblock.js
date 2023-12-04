import React, {useState, useEffect, useRef} from "react";
import {useParams} from 'react-router-dom';
import io from 'socket.io-client';
import hljs from 'highlight.js';    
import javascript from 'highlight.js/lib/languages/javascript';
import * as atom from '../atom-one-dark.css';

const socket = io.connect("https://online-coding-web-application.onrender.com");

function CodeBlock() {
    const { id } = useParams();
    const codeBlocks = ['Async task', 'Sync task', 'React task', 'Node task'];
    const [code, setCode] = useState("Loading code...");
    const [codeReceived, setCodeReceived] = useState(code);
    const [titleReceived, setTitleReceived] = useState(null);
    const [mentor, setMentor] = useState(true);
    const codeRef = useRef(null);

    // Responsive code editor sends its code to the server after each change
    const updateCode = (event) => {
        setCode(event.target.innerText);
        socket.emit(`send_code_${id}`, { code });
    }

    // Each id represents a code block room or page
    useEffect(() => {
        // Notify server for page first render to get current code
        socket.emit(`connect_${id}`, `${id}`);
        hljs.registerLanguage('javascript', javascript);
        hljs.highlightAll();
    
        socket.on("user_counter", (data) => {
            setMentor(data == 2);
        });

        // Server sends the code after page first rendered
        socket.on(`init_${id}`, (data) => {
            setCodeReceived(data.code);
            setTitleReceived(data.title);
        });

        // Mentor gets the student code from server
        socket.on(`receive_code_${id}`, (data) => {
            setCodeReceived(data.code);
            setTitleReceived(data.title);
        })}, [socket]);

    return (
        <div>
            { titleReceived ? <h1>{titleReceived}</h1> : <h1>{codeBlocks[id - 1]}</h1> }
            { mentor ? <h3>Mentor</h3> : <h3>Student</h3> }
            <pre>
                <code className="language-javascript"
                      style={atom}
                      ref={codeRef} 
                      contentEditable={!mentor} 
                      onInput={updateCode}>
                  {codeReceived}
                </code>
            </pre>
        </div>
    );
}

export default CodeBlock;