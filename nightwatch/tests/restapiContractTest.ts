//Here the contract is defined for the api "https://api.restful-api.dev/objects" that returns the details of an "Apple MacBook Pro 16".
// {
//     "status": 200,
//     "responseBody": {
//       "id": "string",
//       "name": "Apple MacBook Pro 16",
//       "data": {
//         "year": 2019,
//         "price": 1849.99,
//         "CPU model": "Intel Core i9",
//         "Hard disk size": "1 TB"
//       }
//     }
//   }
  

import { NightwatchTest, NightwatchBrowser, NightwatchTests } from 'nightwatch';
import superagent from 'superagent';

const restapiContractTest: NightwatchTests = {
  '@tags': ['contract'],

  'Verify REST API contract': async function (browser: NightwatchBrowser) {
    const expectedResponse = {
      id: 'string',  // Assuming the id is a string, this might be checked differently based on actual response
      name: 'Apple MacBook Pro 16',
      data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
      },
    };

    try {
      const res = await superagent
        .post('https://api.restful-api.dev/objects')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .disableTLSCerts()
        .send({
          name: 'Apple MacBook Pro 16',
          data: {
            year: 2019,
            price: 1849.99,
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
          },
        });

      console.info('API Results fetched');
      console.log('API response:', res.body);

      // Assert status code
      browser.assert.equal(res.status, 200, 'Expected status code 200');

      // Assert response structure and values
      browser.assert.equal(res.body.name, expectedResponse.name, 'Expected name to match');
      browser.assert.deepEqual(res.body.data, expectedResponse.data, 'Expected data to match');

      // Additional checks for id
      browser.assert.equal(typeof res.body.id, 'string', 'Expected id to be a string');

    } catch (err) {
      console.error('###');
      console.error(err);
    } finally {
      browser.end();
    }
  },
};

export default restapiContractTest;

// Expected Response: The expected response structure is defined with expected values. This includes fields such as name and data.
// Superagent POST Request: Sends the POST request to the API endpoint.
// Status Code Assertion: Checks if the API response status code is 200.
// Response Body Assertions: Checks if the API response body matches the expected structure and values. The id field is also checked to ensure it is a string.
// Error Handling: Logs any errors encountered during the API call.
// Ending Browser Session: Ensures the browser session ends after the test.
