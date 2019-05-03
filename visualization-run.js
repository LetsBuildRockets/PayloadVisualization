var processingInstance;

function setAngles(x, y, z){
  if (!processingInstance) {
    processingInstance = Processing.getInstanceById('sketch');
  }
  processingInstance.setAngles(x, y, z);
}

function smoothstep(edge0, edge1, x)
{
    edge0 = scale(edge0);
    edge1 = scale(edge1);
    // Scale, bias and saturate x to 0..1 range
    var x = (edge1 - edge0)*x+edge0
    // Evaluate polynomial
    return unscale(x*x*(3 - 2*x));
}

function scale(x) {
  return (x+180)/360
}
function unscale(y) {
  return y*360-180
}

(function draw() {
  var steplength = 100;
  var msec = + new Date();
  if(endtime < msec) {
    endtime = msec + steplength; // Set endtime for next frame (50ms in the future)
    d0 = d1;
    d1 = d2;
  }
  var x = (msec - (endtime - steplength))/steplength;
  if(d1 && d0) {
    setAngles(smoothstep(d0['pitch'],d1['pitch'],x)+90,smoothstep(d0['roll'],d1['roll'],x),-smoothstep(d0['heading'],d1['heading'],x));
    }
  requestAnimationFrame(draw);
}) ()

/*setInterval(function() {
  setAngles(document.getElementById("x").value, document.getElementById("y").value, document.getElementById("z").value);
},100);*/

var endtime = 0;
var d0 = 0;
var d1 = 0;
var d2 = 0;
var socket = io();
socket.on('data', function(data) {
  //console.log(data);
  d2 = data;
  document.getElementById("alt").value = data['alt'];
  document.getElementById("temp").value = data['temp'];
  document.getElementById("pitch").value = data['pitch'];
  document.getElementById("roll").value = data['roll'];
  document.getElementById("heading").value = data['heading'];
  document.getElementById("xLin").value = data['xLin'];
  document.getElementById("yLin").value = data['yLin'];
  document.getElementById("zLin").value = data['zLin'];
});
