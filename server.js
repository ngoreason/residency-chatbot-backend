const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const cors = require('cors');
const {GoogleAuth} = require('google-auth-library');

// Load credentials from the environment variable
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Create a Dialogflow session client with credentials
const client = new dialogflow.SessionsClient({
  credentials: credentials
});

// Continue with your Dialogflow setup and API calls...

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'residency-chatbot.html'));
});

// Replace with your actual file name and project ID
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: 'residencyfaqbot-dojy-1278931c56e1.json'
});

const projectId = 'residencyfaqbot-dojy'; // e.g., dialogflow-demo-123456

app.post('/query', async (req, res) => {
  try {
    const userMessage = req.body.message;
    // Your Dialogflow or chatbot logic here
    res.json({ reply: 'Your response here' });
  } catch (error) {
    console.error('Error handling /query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/chat', async (req, res) => {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);}

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to Dialogflow');
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
