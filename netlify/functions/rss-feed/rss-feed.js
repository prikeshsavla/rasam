// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2

import fetch from 'node-fetch';

const handler = async (event) => {
  
  const url = event.queryStringParameters.url;

  try {
    const response = await fetch(url);
    const xmlString = await response.text();
    console.log();

    return {
      statusCode: 200,
      body: xmlString,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch or parse RSS feed' }),
    };
  }
};
module.exports = { handler }

