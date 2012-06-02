// Copyright 2011-2012 Kevin Reid under the terms of the MIT License as detailed
// in the accompanying file README.md or <http://opensource.org/licenses/MIT>.

// Global option structure.

var CubesConfig = (function () {
  "use strict";
  
  function Config(storage, storagePrefix) {
    var config = this;
    
    function defineOption(name, type, value) {
      config[name] = new PersistentCell(storage, storagePrefix + name, type, value);
    }
    
    Object.defineProperty(config, "resetAllOptions", {value: function () {
      Object.keys(config).forEach(function (k) { config[k].setToDefault(); });
    }});
    
    defineOption("controls", "object", Input.defaultBindings);
    defineOption("fov", "number", 60);
    defineOption("renderDistance", "number", 100);
    defineOption("mouseTurnRate", "number", 4); // radians/second/half-screen-width
    defineOption("lighting", "boolean", true);
    defineOption("smoothLighting", "boolean", true);
    defineOption("bumpMapping", "boolean", true);
    defineOption("fsaa", "boolean", false);
    defineOption("cubeParticles", "boolean", false);
    defineOption("sound", "boolean", true);
    defineOption("noclip", "boolean", false);
    defineOption("alwaysGenerateWorld", "boolean", false);
    defineOption("debugTextureAllocation", "boolean", false);
    defineOption("debugForceRender", "boolean", false);
    defineOption("debugPlayerCollision", "boolean", false);
    
    defineOption("generate_wx", "number", 400);
    defineOption("generate_wy", "number", 128);
    defineOption("generate_wz", "number", 400);
    defineOption("generate_shape", "string", "fill");
    defineOption("generate_slope", "number", 0.9);
    defineOption("generate_tileSize", "number", 16);
    defineOption("generate_name", "string", "Untitled");
    defineOption("generate_blockset", "string", "Default Blockset"); // TODO UI for this
    
    defineOption("currentTopWorld", "string", "Untitled");
  }
  
  return Config;
}());
