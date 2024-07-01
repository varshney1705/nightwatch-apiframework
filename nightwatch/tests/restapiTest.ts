import { NightwatchTest,NightwatchBrowser, NightwatchTests } from "nightwatch";
import superagent from 'superagent';

const restapiTest :NightwatchTests={
    '@tags':['restapi'],

    'Verify rest api response':async () => {
        await superagent
           .post('https://api.restful-api.dev/objects')
           .set('Content-Type','application/json')
           .set('Accept','application/json')
           .disableTLSCerts()
           .send(
            {
                "name": "Apple MacBook Pro 16",
                "data": {
                   "year": 2019,
                   "price": 1849.99,
                   "CPU model": "Intel Core i9",
                   "Hard disk size": "1 TB"
                }
             }
           )
           .then(async (res) => {
            console.info(`Api Results is fetch`);
            console.log('Api resposne:',res.text);
            browser.assert.equal(
                res.status,
                200,
                'Expected status code 200'
              );
           })

        .catch((err)=>{
            console.error('###');
            console.error(err);
        });
        
    },
};
export default restapiTest;
