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
 *
 */
function atcocif(cifFile: Readable) {
  const emitter = new EventEmitter();

  const lineStream = byline(cifFile);

  lineStream.on('data', (data) => {
    const line = data.toString();
    const header = line.slice(0, 2);
    if (header === 'QT') {
      emitter.emit('journey');
    }
  });

  lineStream.on('end', () => {
    emitter.emit('end');
  });

  return emitter;
}

module.exports = atcocif;
