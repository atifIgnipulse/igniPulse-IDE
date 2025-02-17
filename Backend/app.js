require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const http = require("http")
const { Server } = require("socket.io");
const app = express();
const mysql = require('mysql2')

// 1. create hppt server for app
const server = http.createServer(app);
// 2. create io for socket
const allowedOrigins = ["http://frontend:8080", "http://igniup.com:8080"]
const io = new Server(server, {
    cors: {
        origin: (origin, callback)=>{
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true)
            }else{
                callback(new Error("Not Allowed by cors"))
            }
        }
    }
});

app.use(cors());

app.use(express.json());


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
})
// listen for connection from client
io.on("connection", (socket) => {
    console.log("connection established with user:", socket.id);

    // listen for messages from client
    socket.on("runPy", async (data) => {

        let final_input_to_python = []
        const input = data.split('\n').filter(line => line.trim() != '');
        // console.log(input)
        let currentIndex = 0;
        const processNextLine = async () => {
            if (currentIndex < input.length) {
                let line = input[currentIndex];
                const match = line.match(/input\(["'](.*?)["']\)/);

                if (match) {
                    // Emit user input prompt to the client
                    socket.emit("userInput", match[1]);

                    // Wait for user input
                    await new Promise((resolve) => {
                        socket.once("userEntry", (userInput) => {
                            // check if userInput is a string
                            if (userInput.match(/^\d+$/)) {
                                // Replace the input line with the user's input
                                line = line.replace(match[0], userInput);
                                final_input_to_python.push(line);
                            } else {
                                // Replace the input line with the user's input
                                line = line.replace(match[0], `"` + userInput + `"`);
                                final_input_to_python.push(line);
                            }
                            currentIndex++;
                            resolve();
                        });
                    });
                    await processNextLine(); 
                } else {
                    final_input_to_python.push(line);
                    currentIndex++;
                    await processNextLine();
                }
            } else {
                // All lines are processed, now execute the Python code
                // console.log(final_input_to_python.join("\n"))
                execPy(socket, final_input_to_python.join("\n"));
            }
        }

        // Start processing input lines
        await processNextLine();

    })

    const execPy = (socket, code) => {
        // console.log(code)

        var result = "";
        let error = "";

        const pyProcess = spawn('python3', ['-c', code]);
        pyProcess.stdout.on('data', (data) => {
            result += data.toString();
            // console.log(result)
            // socket.emit("pyResponse", result); // Send other outputs to the client   

        })

        pyProcess.stderr.on('data', (data) => {
            error += data.toString();
        });
        // Listen for input from the client and forward it to the Python script


        pyProcess.on('close', (code) => {
            if (code === 0) {
                socket.emit("pyResponse", result)
            } else {
                socket.emit("pyResponse", error)
            }
        }
        );
    }

    socket.on("disconnect", () => {
        console.log("disconnected user:", socket.id);
    })

})

app.post('/postData', async (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("connected to mysql")
        }
    })
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ error: "SQL script is required." });
        }

        connection.query(data, (err, result) => {
            if (err) {
                res.send(err)
            } else {
                // console.log(result[0])
                res.json({ success: true, result });

            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/getDataBases', async (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("connected to mysql")
        }
    })
    connection.query("show databases", (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result.map((database) => {

                return database.Database
            }))
        }
    })

})

app.get('/getTables', async (req, res) => {
    const db_name = req.query.db;
    connection.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("connected to mysql")
        }
    })

    connection.query(`use ${db_name};`, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            const query = `
                SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = ?;
            `
            connection.query(query, [db_name], (err, result)=>{
                if(err){
                    res.send(err)
                }else{
                    res.send(result)
                }
            })
        }
    })

})

app.post('/switchDB', async (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("connected to mysql")
        }
    })
    try {
        connection.query(`use ${req.body.database};`, (err, result) => {
            if (err) {
                return res.send(err);
            } else {
                res.send(result)
            }
        })
    } catch (error) {
        res.send(error)
    }
})

app.get(('/ping', (req, res)=>{
    res.status(200).send("pong.")
}))

const port = process.env.PORT || 9000
server.listen(port,'0.0.0.0',() => console.log(`Server started at port ${port}`))
