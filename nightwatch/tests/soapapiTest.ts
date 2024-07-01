import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import superagent from 'superagent';
import xml2js from 'xml2js';

const soapApiTest: NightwatchTests = {
  '@tags': ['soapapi'],

  'Convert Number to Words': async function (browser: NightwatchBrowser) {
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

    const url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso';

    try {
      const res = await superagent
        .post(url)
        .set('Content-Type', 'text/xml')
        .set('SOAPAction', 'http://www.dataaccess.com/webservicesserver/NumberToWords')
        .send(soapRequest);

      console.info('SOAP API Results fetched');
      console.log('SOAP API response:', res.text);

      // Assert status code
      browser.assert.equal(
        res.status,
        200,
        'Expected status code 200'
      );
      browser.assert.ok(
        res.text.includes('<m:NumberToWordsResult>five hundred </m:NumberToWordsResult>'),
        'Expected response to contain "five hundred "'
      );
      // Parse the XML response
    //   xml2js.parseString(res.text, (err, result) => {
    //     if (err) {
    //       console.error('Failed to parse XML response:', err);
    //     } else {
    //       console.log('Parsed SOAP response:', result);
    //     }
    //   });
    } catch (err) {
      console.error('###');
      console.error(err);
    } finally {
      browser.end();
    }
  },
};

export default soapApiTest;
