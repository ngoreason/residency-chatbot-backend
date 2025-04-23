const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your actual file name and project ID
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: 'residencyfaqbot-dojy-1278931c56e1.json'
});

const projectId = 'residencyfaqbot-dojy'; // e.g., dialogflow-demo-123456

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
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to Dialogflow');
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
