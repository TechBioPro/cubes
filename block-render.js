// Renders single blocks from a world.

function BlockRenderer(blockSet) {
  var singleBlockWorld = new World([1,1,1], blockSet);
  singleBlockWorld.s(0,0,0,1);
  singleBlockR = new WorldRenderer(singleBlockWorld, {pos: [0,0,0]});
  
  var rttFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = 64;
  rttFramebuffer.height = 64;

  var renderbuffer1 = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer1);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, rttFramebuffer.width, rttFramebuffer.height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer1);

  var renderbuffer2 = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer2);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer2);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  var ow = 0.8;
  var oh = 0.8;
  
  function blockToImageData(blockID, context2d) {
    // TODO: global variables gl, mvMatrix, pMatrix
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
    
    gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var savePMatrix = pMatrix;
    var saveMVMatrix = mvMatrix;
    pMatrix = mat4.create();
    mat4.ortho(-ow, ow, -oh, oh, -1, 1, pMatrix); // Y-coordinates are flipped to get the image rightwayup
    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, Math.PI/4 * 0.6, [1, 0, 0]);
    mat4.rotate(mvMatrix, Math.PI/4 * 0.555, [0, 1, 0]);
    mat4.translate(mvMatrix, [-0.5,-0.5,-0.5]);
    singleBlockWorld.s(0,0,0,blockID);
    singleBlockR.dirtyBlock(0,0);
    singleBlockR.updateSomeChunks();
    singleBlockR.draw();
    
    // restore stuff (except for framebuffer which we're about to read)
    pMatrix = savePMatrix;
    mvMatrix = saveMVMatrix;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    
    var imageData = context2d.createImageData(rttFramebuffer.width, rttFramebuffer.height);
    var arrayC = imageData.data;
    var arrayGL = new Uint8Array(rttFramebuffer.width * rttFramebuffer.height * 4);
    gl.readPixels(0, 0, rttFramebuffer.width, rttFramebuffer.height, gl.RGBA, gl.UNSIGNED_BYTE, arrayGL);
    { // copy into canvas data and flip y
      var h = rttFramebuffer.height;
      var w = rttFramebuffer.width * 4; // width in bytes
      for (var y = h; y--; y >= 0) {
        var nyl = (h - y) * w;
        var pyl = y * w;
        for (var i = w - 1; i >= 0; i--)
          arrayC[nyl + i] = arrayGL[pyl + i];
      }
    }
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    return imageData;
  }

  return {
    blockToImageData: blockToImageData,
    delete: function () {
      rttFramebuffer = null;
      gl.deleteRenderbuffer(renderbuffer1);
      gl.deleteRenderbuffer(renderbuffer2);
      gl.deleteFramebuffer(rttFramebuffer);
      singleBlockR.delete();
    }
  }
}