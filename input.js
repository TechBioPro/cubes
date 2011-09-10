// TODO: explicitly connect global vars

function Input(eventReceiver, playerInput) {
  "use strict";

  var keymap = [];
  
  function evalVel(pos, neg) {
    return pos ? neg ? 0 : 1 : neg ? -1 : 0;
  }
  function interestingInMap(code) {
    switch (code) {
      case 'A'.charCodeAt(0): case 37:
      case 'W'.charCodeAt(0): case 38:
      case 'D'.charCodeAt(0): case 39:
      case 'S'.charCodeAt(0): case 40:
      case 'E'.charCodeAt(0):
      case 'C'.charCodeAt(0):
        return true;
      default:
        return false;
    }
  }
  function evalKeys() {
    var l = keymap['A'.charCodeAt(0)] || keymap[37];
    var r = keymap['D'.charCodeAt(0)] || keymap[39];
    var f = keymap['W'.charCodeAt(0)] || keymap[38];
    var b = keymap['S'.charCodeAt(0)] || keymap[40];
    var u = keymap['E'.charCodeAt(0)];
    var d = keymap['C'.charCodeAt(0)];
    
    playerInput.movement = [
      evalVel(r, l),
      evalVel(u, d),
      evalVel(b, f)
    ];
  }
  
  eventReceiver.addEventListener("keydown", function (event) {
    // avoid disturbing browser shortcuts
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    
    var code = event.keyCode || event.which;

    // handlers for 'action' keys (immediate effects)
    switch (String.fromCharCode(code)) {
      case "R": playerInput.changeWorld(1); return false;
      case "F": playerInput.changeWorld(-1); return false;
    }

    // 'mode' keys such as movement directions go into the keymap
    if (interestingInMap(code)) {
      keymap[code] = true;
      evalKeys();
      return false;
    } else {
      return true;
    }
  }, false);
  eventReceiver.addEventListener("keyup", function (event) {
    var code = event.keyCode || event.which;
    if (interestingInMap(code)) {
      var wasSetInMap = keymap[code];
      keymap[code] = false;
      evalKeys();
      return !wasSetInMap;
    } else {
      return true;
    }
  }, false);
  
  
  var dx = 0;
  
  eventReceiver.addEventListener("mousemove", function (event) {
    var swingY = event.clientY / (gl.viewportHeight*0.5) - 1;
    var swingX = event.clientX / (gl.viewportWidth*0.5) - 1;
    
    // y effect
    playerInput.pitch = -Math.PI/2 * swingY;
    
    // x effect
    dx = -0.2 * deadzone(swingX, 0.2);
  }, false);
  eventReceiver.addEventListener("mouseout", function (event) {
    dx = 0;
  }, false);

  eventReceiver.addEventListener("click", function (event) {
    playerInput.click([event.clientX, event.clientY], 0);
    return false;
  }, false);
  eventReceiver.oncontextmenu = function (event) {
    // On Firefox 5.0.1 (most recent tested 2011-09-10), addEventListener does not suppress the builtin context menu, so this is an attribute rather than a listener.
    playerInput.click([event.clientX, event.clientY], 1);
    return false;
  };
  
  function step() {
    if (dx != 0) {
      playerInput.yaw += dx;
    }
  }
  
  this.step = step;
}
