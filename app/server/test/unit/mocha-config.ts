//global declare
declare global {
  var assert: any;
  var config: any;
  var mongo: any; //mongoose
}

//make assert global
import assert from 'assert';
global.assert = assert;

// //sinon config
// import * as sinon from 'sinon';
// sinon.config = {
//   useFakeTimers: false
// };