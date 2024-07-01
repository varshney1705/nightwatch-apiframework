import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import superagent from 'superagent';

const combinedContractTest: NightwatchTests = {
  '@tags': ['combinedContractTest'],

  'Verify REST and SOAP API contract': async function (browser: NightwatchBrowser) {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.dataaccess.com/webservicesserver/">
         <soapenv:Header/>
         <soapenv:Body>
            <web:NumberToWords>
               <ubiNum>500</ubiNum>
            </web:NumberToWords>
         </soapenv:Body>
      </soapenv:Envelope>
    `;

    const soapUrl = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso';
    const restUrl = 'https://api.restful-api.dev/objects';

    let soapResult, restResult;

    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        // SOAP API Request
        const soapRes = await superagent
          .post(soapUrl)
          .set('Content-Type', 'text/xml')
          .set('SOAPAction', 'http://www.dataaccess.com/webservicesserver/NumberToWords')
          .send(soapRequest)
          .timeout({
            response: 10000, // Wait 10 seconds for the server to start sending,
            deadline: 60000, // but allow 60 seconds for the file to finish loading.
          });

        console.info('SOAP API Results fetched');
        console.log('SOAP API response:', soapRes.text);

        // Assert status code for SOAP
        browser.assert.equal(soapRes.status, 200, 'Expected SOAP status code 200');

        // Check if the response contains the expected text
        browser.assert.ok(
          soapRes.text.includes('<m:NumberToWordsResult>five hundred </m:NumberToWordsResult>'),
          'Expected SOAP response to contain "five hundred "'
        );

        // REST API Request
        const restRes = await superagent
          .post(restUrl)
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

        console.info('REST API Results fetched');
        console.log('REST API response:', restRes.body);

        // Assert status code for REST
        browser.assert.equal(restRes.status, 200, 'Expected REST status code 200');

        // Assert REST response structure and values
        const expectedRestResponse = {
          name: 'Apple MacBook Pro 16',
          data: {
            year: 2019,
            price: 1849.99,
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
          },
        };

        browser.assert.equal(restRes.body.name, expectedRestResponse.name, 'Expected name to match');
        browser.assert.deepEqual(restRes.body.data, expectedRestResponse.data, 'Expected data to match');

        // Additional checks for id
        browser.assert.equal(typeof restRes.body.id, 'string', 'Expected id to be a string');

        success = true; // If everything goes well, set success to true
      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
        attempt++;
        if (attempt === maxRetries) {
          console.error('Max retries reached. Failing test.');
          throw err; // Re-throw error after max retries
        }
      }
    }

    browser.end();
  },
};

export default combinedContractTest;

// Combined Contract Test: This test combines the SOAP and REST API tests. 
// It performs retries to handle network issues and verifies the expected 
// responses from both APIs. The SOAP response check is done using a simple
//  string matching approach. 
