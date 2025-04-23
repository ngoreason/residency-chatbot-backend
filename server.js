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
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './credentials.json'
});

const projectId = 'residencyfaqbot-dojy'; // Replace with your real project ID

app.post('/query', async (req, res) => {
  const sessionId = uuidv4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

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
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ reply: 'Sorry, something went wrong with the chatbot.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
