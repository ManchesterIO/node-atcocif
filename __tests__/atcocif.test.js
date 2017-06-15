import { createReadStream } from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

import atcocif from '../src/atcocif';

describe('atcocif', () => {
  it('emits end when the file has downloaded', (done) => {
    const fakeCif = new PassThrough();
    const cifParser = atcocif(fakeCif);

    cifParser.on('end', () => { done(); });
    fakeCif.end();
  });

  it('emits a single journey', () => parseJourneys('simple_journey.cif')
        .then((journeys) => {
          expect(journeys.length).toBe(1);
        }),
    );
});

function parseJourneys(filename) {
  return new Promise((resolve) => {
    const journeys = [];
    const cifParser = atcocif(createReadStream(path.join(__dirname, filename)));
    cifParser.on('journey', (journey) => {
      journeys.push(journey);
    });
    cifParser.on('end', () => {
      resolve(journeys);
    });
  });
}
