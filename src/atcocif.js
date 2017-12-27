// @flow

/*
 Copyright 2017 Chris Northwood

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import byline from 'byline';
import type { Readable } from 'stream';
import EventEmitter from 'events';

/**
 * Takes a stream of a CIF file, and then emits journeys that are parsed from
 * the file contents.
 *
 * @function atcocif
 * @param {Readable} cifFile A readable stream of the CIF file to be parsed
 * @emits atcocif#journey
 * @emits atcocif#end
 * @returns {EventEmitter}
 */
export default function atcocif(cifFile: Readable) {
  const emitter = new EventEmitter();

  const lineStream = byline(cifFile);
  let thisJourney;

  lineStream.on('data', (data) => {
    const line = data.toString();
    const header = line.slice(0, 2);
    if (header === 'QS') {
      thisJourney = {
        operator: line.slice(3, 7).trim(),
        id: line.slice(7, 13).trim(),
        startDate: line.slice(13, 21),
        endDate: line.slice(21, 29),
        runsOnMonday: line[29] === '1',
        runsOnTuesday: line[30] === '1',
        runsOnWednesday: line[31] === '1',
        runsOnThursday: line[32] === '1',
        runsOnFriday: line[33] === '1',
        runsOnSaturday: line[34] === '1',
        runsOnSunday: line[35] === '1',
      };
    } else if (header === 'QT') {
      emitter.emit('journey', thisJourney);
    }
  });

  lineStream.on('end', () => {
    emitter.emit('end');
  });

  return emitter;
}

/**
 * An event that is emitted when a journey is detected in the file
 *
 * @event atcocif#journey
 * @type {object}
 * @property id {string} unique identifier of a journey by an operator
 * @property operator {string} short code form of operator name
 * @property startDate {string} first date of operation (YYYYMMDD)
 * @property endDate {string} first date of operation (YYYYMMDD)
 * @property runsOnMonday {bool} does this service run on a Monday
 * @property runsOnTuesday {bool} does this service run on a Tuesday
 * @property runsOnWednesday {bool} does this service run on a Wednesday
 * @property runsOnThursday {bool} does this service run on a Thursday
 * @property runsOnFriday {bool} does this service run on a Friday
 * @property runsOnSaturday {bool} does this service run on a Saturday
 * @property runsOnSunday {bool} does this service run on a Sunday
 */

/**
 * An event that is emitted when the file has been parsed
 *
 * @event atcocif#end
 */
