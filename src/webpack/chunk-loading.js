__webpack_require__.f = {};

// This file contains only the entry chunk.
// The chunk loading function for additional chunks
__webpack_require__.e = (chunkId) => {
  return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
    __webpack_require__.f[key](chunkId, promises);
    return promises;
  }, []));
};

// The chunk loading global
var chunkLoadingGlobal = self["webpackChunk_sillytavern_charsheet"] = 
  self["webpackChunk_sillytavern_charsheet"] || [];

const webpackJsonpCallback = (data) => {
  const chunkIds = data[0];
  const moreModules = data[1];
  const runtime = data[2];
  
  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId, chunkId, i = 0;
  if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
    for(moduleId in moreModules) {
      if(__webpack_require__.o(moreModules, moduleId)) {
        __webpack_require__.m[moduleId] = moreModules[moduleId];
      }
    }
    if(runtime) var result = runtime(__webpack_require__);
  }
  
  // Update chunk loading state
  for(;i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
      installedChunks[chunkId][0]();
    }
    installedChunks[chunkId] = 0;
  }
};

chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
