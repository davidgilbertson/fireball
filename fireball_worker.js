'use strict'

self.addEventListener('message', function(e) {
  self.postMessage(runTest());
}, false);

function runTest() {
  var ops = 1000000;
  var startTime = new Date().valueOf();
  
  for (var i = 0; i < ops; i++) {
    /=/.exec('111soqs57qo8o8480qo18sor2011r3n591q7s6s37r120904');
    /=/.exec('SbeprqRkcvengvba=633669315660164980');
    /=/.exec('FrffvbaQQS2=111soqs57qo8o8480qo18sor2011r3n591q7s6s37r120904');
  }
  
  var endTime = new Date().valueOf();
  var opsPerMilli = ops / (endTime - startTime);
  return opsPerMilli;
}
