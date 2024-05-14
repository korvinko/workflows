import * as Groq from "groq-sdk";
import * as fs from "fs";
import * as path from "path";

const outputFolder = "output";
const codeFolder = `${outputFolder}/code`;
const listOfFilesPath = `${outputFolder}/list_of_files.json`;
const lastHandledIndexPath = `${outputFolder}/index`;
const lastResponseIdPath = `${outputFolder}/last_response_id`;

export async function fetchGroqResponse(prompt) {
    const groq = new Groq.Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    const model = process.env.GROQ_MODEL

    let files;
    let lastHandledIndex;
    let lastResponseId;
    let messageHistory = [];

    try {
        const filesBuffer = fs.readFileSync(listOfFilesPath).toString('utf8');
        files = JSON.parse(filesBuffer);
        lastHandledIndex = fs.readFileSync(lastHandledIndexPath).toString('utf8');
        lastResponseId = fs.readFileSync(lastResponseIdPath).toString('utf8');
    } catch (e) {}

    if (lastHandledIndex && files && +lastHandledIndex >= files.length - 1) {
        lastHandledIndex = undefined;
        files = undefined;
        lastResponseId = undefined;
    }

    if (!files || !lastHandledIndex || !lastResponseId) {
        // Send the initial message and wait for the response
        let res = await getGroqChatCompletion(groq, model, prompt, messageHistory);
        console.log(res.choices[0]?.message?.content);

        // Add the user message and the assistant's response to the message history
        messageHistory.push({ role: "user", content: prompt });
        messageHistory.push({ role: "assistant", content: res.choices[0]?.message?.content });

        // Send a follow-up message
        const followUpPrompt = 'can you show me all files again but in json format as array of strings?';
        res = await getGroqChatCompletion(groq, model, followUpPrompt, messageHistory);
        console.log(res.choices[0]?.message?.content);

        // Add the follow-up prompt and the assistant's response to the message history
        messageHistory.push({ role: "user", content: followUpPrompt });
        messageHistory.push({ role: "assistant", content: res.choices[0]?.message?.content });

        const regex = /```[^]*?```/g;
        const matches = res.choices[0]?.message?.content.match(regex);

        if (matches) {
            const parsedBlock = matches[0].slice(3, -3).trim().replace('json', '');
            files = JSON.parse(parsedBlock);
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
            return;
        }

        lastResponseId = res.id;
        lastHandledIndex = -1;
    }

    for (let index in files) {
        if (+index <= +lastHandledIndex) {
            continue;
        }

        let res = await generateFile(groq, model, files[index], lastResponseId, messageHistory);
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
        console.log(res.id);

        res = await generateTestFile(groq, model, files[index], lastResponseId, messageHistory);
        if (res !== undefined) {
            fs.writeFile(lastResponseIdPath, res.id, (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                } else {
                    console.log('File created successfully.');
                }
            });

            console.log(res.id);
        }
    }
}

async function getGroqChatCompletion(groq, model, content, messageHistory) {
    messageHistory.push({ role: "user", content });
    return groq.chat.completions.create({
        messages: messageHistory,
        model: model
    });
}

async function generateFile(groq, model, file, parentId, messageHistory) {
    const prompt = `show me the whole implementation of ${file} without stubs or unimplemented places`;

    console.log(prompt);
    console.log(parentId);

    const res = await getGroqChatCompletion(groq, model, prompt, messageHistory);
    console.log(res.choices[0]?.message?.content);

    const regex = /```(?:[^`\n]+)?\n([\s\S]+?)\n```/g;
    const matches = regex.exec(res.choices[0]?.message?.content);
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

async function generateTestFile(groq, model, file, parentId, messageHistory) {
    if (file.indexOf(".go") === -1) {
        return undefined;
    }

    file = file.replace(".go", "_test.go");

    const prompt = `show me the whole implementation of test for the file ${file} without unimplemented places`;

    console.log(prompt);
    console.log(parentId);

    const res = await getGroqChatCompletion(groq, model, prompt, messageHistory);
    console.log(res.choices[0]?.message?.content);

    const regex = /```(?:[^`\n]+)?\n([\s\S]+?)\n```/g;
    const matches = regex.exec(res.choices[0]?.message?.content);
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

