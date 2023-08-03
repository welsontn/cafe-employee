//global declare
declare global {
  var assert: any;
}

//make assert global
import assert from 'assert';
global.assert = assert;

// //sinon config
// import * as sinon from 'sinon';
// sinon.config = {
//   useFakeTimers: false
// };