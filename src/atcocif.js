// @flow

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
