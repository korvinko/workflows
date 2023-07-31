import {ChatGPTAPI, ChatMessage} from "chatgpt";
import * as fs from "fs";
import * as path from "path";

const outputFolder = "output";
const codeFolder = `${outputFolder}/code`;
const listOfFilesPath = `${outputFolder}/list_of_files.json`;
const lastHandledIndexPath = `${outputFolder}/index`;
const lastResponseIdPath = `${outputFolder}/last_response_id`;

export async function fetchGptResponse(prompt) {
    const api = new ChatGPTAPI({apiKey: process.env.OPENAI_API_KEY})

    let files;
    let lastHandledIndex;
    let lastResponseId;

    try {
        const filesBuffer = fs.readFileSync(listOfFilesPath).toString('utf8');
        files = JSON.parse(filesBuffer)
        lastHandledIndex = fs.readFileSync(lastHandledIndexPath).toString('utf8');
        lastResponseId = fs.readFileSync(lastResponseIdPath).toString('utf8');
    } catch (e) {}

    if (lastHandledIndex && files && +lastHandledIndex >= files.length-1) {
        lastHandledIndex = undefined;
        files = undefined;
        lastResponseId = undefined;
    }

    if (!files || !lastHandledIndex || !lastResponseId) {
        // send a message and wait for the response
        let res = await api.sendMessage(prompt)
        console.log(res.text)

        // send a follow-up
        res = await api.sendMessage('can you show me all files again but in json format as array of strings?', {
            parentMessageId: res.id
        })
        console.log(res.text)

        const regex = /```[^]*?```/g;
        const matches = res.text.match(regex);

        if (matches) {
            const parsedBlock = matches[0].slice(3, -3).trim().replace('json', '');
            files = JSON.parse(parsedBlock)
            fs.writeFile(listOfFilesPath, parsedBlock, (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                } else {
                    console.log('File created successfully.');
                }
            });


            console.log(files);
        } else {
            console.error("No json block found.");
            return
        }

        lastResponseId =  res.id;
        lastHandledIndex = -1;
    }

    for (let index in files) {
        if (+index <= +lastHandledIndex) {
            continue;
        }

        let res = await generateFile(api, files[index], lastResponseId);
        lastResponseId = res.id;
        lastHandledIndex = index;
        fs.writeFile(lastResponseIdPath, res.id, (err) => {
            if (err) {
                console.error('Error creating file:', err);
            } else {
                console.log('File created successfully.');
            }
        });
        fs.writeFile(lastHandledIndexPath, index, (err) => {
            if (err) {
                console.error('Error creating file:', err);
            } else {
                console.log('File created successfully.');
            }
        });
        console.log(res.id)

        res = await generateTestFile(api, files[index], lastResponseId);
        if (res !== undefined) {
            fs.writeFile(lastResponseIdPath, res.id, (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                } else {
                    console.log('File created successfully.');
                }
            });

            console.log(res.id)
        }
    }
}

export async function generateFile(api: ChatGPTAPI, file: string, parentId: string): Promise<ChatMessage> {
    const promt = `show me the whole implementation of ${file} without stubs or unimplemented places`;

    console.log(promt)
    console.log(parentId)

    const res = await api.sendMessage(promt, {
        parentMessageId: parentId,
    })
    console.log(res.text)

    const regex = /```(?:[^`\n]+)?\n([\s\S]+?)\n```/g;
    const matches = regex.exec(res.text);
    let parsedCode;

    if (matches) {
        parsedCode = matches[1].trim();
    } else {
        console.error("No code block found.");
    }

    const filePath = `${codeFolder}/${file}`;
    const parentFolder = path.dirname(filePath);
    if (!fs.existsSync(parentFolder)) {
        fs.mkdirSync(parentFolder, { recursive: true });
    }

    fs.writeFile(filePath, parsedCode, (err) => {
        if (err) {
            console.error('Error creating file:', err);
        } else {
            console.log('File created successfully.');
        }
    });

    return res;
}

export async function generateTestFile(api: ChatGPTAPI, file: string, parentId: string): Promise<ChatMessage> {
    if (file.indexOf(".go") === -1) {
        return undefined;
    }

    file = file.replace(".go", "_test.go")

    const promt = `show me the whole implementation of test for the file ${file} without unimplemented places`;

    console.log(promt)
    console.log(parentId)

    const res = await api.sendMessage(promt, {
        parentMessageId: parentId,
    })
    console.log(res.text)

    const regex = /```(?:[^`\n]+)?\n([\s\S]+?)\n```/g;
    const matches = regex.exec(res.text);
    let parsedCode;

    if (matches) {
        parsedCode = matches[1].trim();
    } else {
        console.warn("No test code block found.");
        return undefined;
    }

    const filePath = `${codeFolder}/${file}`;
    const parentFolder = path.dirname(filePath);
    if (!fs.existsSync(parentFolder)) {
        fs.mkdirSync(parentFolder, { recursive: true });
    }

    fs.writeFile(filePath, parsedCode, (err) => {
        if (err) {
            console.error('Error creating file:', err);
        } else {
            console.log('File created successfully.');
        }
    });

    return res;
}

