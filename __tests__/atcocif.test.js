import { createReadStream } from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

import atcocif from '../src/atcocif';

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

  it('includes the journey header information', () => parseJourneys('simple_journey.cif')
    .then(([journey]) => {
      expect(journey.operator).toEqual('MET');
      expect(journey.id).toEqual('000001');
      expect(journey.startDate).toEqual('20170226');
      expect(journey.endDate).toEqual('20991231');
      expect(journey.runsOnMonday).toBeTruthy();
      expect(journey.runsOnTuesday).toBeTruthy();
      expect(journey.runsOnWednesday).toBeTruthy();
      expect(journey.runsOnThursday).toBeTruthy();
      expect(journey.runsOnFriday).toBeTruthy();
      expect(journey.runsOnSaturday).toBeFalsy();
      expect(journey.runsOnSunday).toBeFalsy();
    }),
  );
});
