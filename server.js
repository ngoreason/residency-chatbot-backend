const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const cors = require('cors');
const {GoogleAuth} = require('google-auth-library');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'residency-chatbot.html')); // Serve the chatbot HTML page
});

// Load credentials from the environment variable
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Create a Dialogflow session client with credentials
const client = new dialogflow.SessionsClient({
  credentials: credentials
});


// Continue with your Dialogflow setup and API calls...

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessionClient = new dialogflow.SessionsClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});


const projectId = 'residencyfaqbot-dojy'; // Replace with your real project ID

app.post('/chat', async (req, res) => {
  const sessionId = uuid.v4();
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
    const [response] = await sessionClient.detectIntent(request);
    res.json({ reply: response.queryResult.fulfillmentText });
  } catch (error) {
    console.error('ERROR in /chat route:', error);
    res.status(500).send('Something went wrong');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
