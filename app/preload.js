(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./main/preload.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


// Types for IPC communication

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electronAPI', {
  checkScoop: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('check-scoop'),
  scoopSearch: query => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-search', query),
  scoopInstall: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-install', app),
  scoopUninstall: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-uninstall', app),
  scoopList: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-list'),
  scoopUpdate: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-update', app),
  scoopInfo: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-info', app),
  scoopBucketList: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-bucket-list'),
  scoopBucketAdd: (name, repo) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-bucket-add', name, repo),
  scoopBucketRm: name => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-bucket-rm', name),
  scoopReset: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-reset', app),
  scoopCleanup: app => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('scoop-cleanup', app),
  openExternal: url => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('open-external', url),
  showMessage: options => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('show-message', options)
});
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBLHFDOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ05xRDs7QUFFckQ7O0FBT0E7QUFDQTtBQUNBQSxtREFBYSxDQUFDRSxpQkFBaUIsQ0FBQyxhQUFhLEVBQUU7RUFDN0NDLFVBQVUsRUFBRUEsQ0FBQSxLQUF3QkYsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGFBQWEsQ0FBQztFQUVyRUMsV0FBVyxFQUFHQyxLQUFhLElBQ3pCTCxpREFBVyxDQUFDRyxNQUFNLENBQUMsY0FBYyxFQUFFRSxLQUFLLENBQUM7RUFFM0NDLFlBQVksRUFBR0MsR0FBVyxJQUN4QlAsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGVBQWUsRUFBRUksR0FBRyxDQUFDO0VBRTFDQyxjQUFjLEVBQUdELEdBQVcsSUFDMUJQLGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRUksR0FBRyxDQUFDO0VBRTVDRSxTQUFTLEVBQUVBLENBQUEsS0FBNEJULGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxZQUFZLENBQUM7RUFFdkVPLFdBQVcsRUFBR0gsR0FBWSxJQUN4QlAsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGNBQWMsRUFBRUksR0FBRyxDQUFDO0VBRXpDSSxTQUFTLEVBQUdKLEdBQVcsSUFDckJQLGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxZQUFZLEVBQUVJLEdBQUcsQ0FBQztFQUV2Q0ssZUFBZSxFQUFFQSxDQUFBLEtBQ2ZaLGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztFQUV6Q1UsY0FBYyxFQUFFQSxDQUFDQyxJQUFZLEVBQUVDLElBQWEsS0FDMUNmLGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRVcsSUFBSSxFQUFFQyxJQUFJLENBQUM7RUFFcERDLGFBQWEsRUFBR0YsSUFBWSxJQUMxQmQsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGlCQUFpQixFQUFFVyxJQUFJLENBQUM7RUFFN0NHLFVBQVUsRUFBR1YsR0FBVyxJQUN0QlAsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGFBQWEsRUFBRUksR0FBRyxDQUFDO0VBRXhDVyxZQUFZLEVBQUdYLEdBQVksSUFDekJQLGlEQUFXLENBQUNHLE1BQU0sQ0FBQyxlQUFlLEVBQUVJLEdBQUcsQ0FBQztFQUUxQ1ksWUFBWSxFQUFHQyxHQUFXLElBQ3hCcEIsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGVBQWUsRUFBRWlCLEdBQUcsQ0FBQztFQUUxQ0MsV0FBVyxFQUFHQyxPQUliLElBQW9DdEIsaURBQVcsQ0FBQ0csTUFBTSxDQUFDLGNBQWMsRUFBRW1CLE9BQU87QUFDakYsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zY29vcC1jbGllbnQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3Njb29wLWNsaWVudC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9zY29vcC1jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2Nvb3AtY2xpZW50L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3Njb29wLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2Nvb3AtY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2Nvb3AtY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2Nvb3AtY2xpZW50Ly4vbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbidcblxuLy8gVHlwZXMgZm9yIElQQyBjb21tdW5pY2F0aW9uXG5pbnRlcmZhY2UgU2Nvb3BSZXN1bHQge1xuICBzdGRvdXQ6IHN0cmluZ1xuICBzdGRlcnI6IHN0cmluZ1xuICBjb2RlOiBudW1iZXJcbn1cblxuLy8gRXhwb3NlIHByb3RlY3RlZCBtZXRob2RzIHRoYXQgYWxsb3cgdGhlIHJlbmRlcmVyIHByb2Nlc3MgdG8gdXNlXG4vLyB0aGUgaXBjUmVuZGVyZXIgd2l0aG91dCBleHBvc2luZyB0aGUgZW50aXJlIG9iamVjdFxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb25BUEknLCB7XG4gIGNoZWNrU2Nvb3A6ICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IGlwY1JlbmRlcmVyLmludm9rZSgnY2hlY2stc2Nvb3AnKSxcblxuICBzY29vcFNlYXJjaDogKHF1ZXJ5OiBzdHJpbmcpOiBQcm9taXNlPFNjb29wUmVzdWx0PiA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc2Nvb3Atc2VhcmNoJywgcXVlcnkpLFxuXG4gIHNjb29wSW5zdGFsbDogKGFwcDogc3RyaW5nKTogUHJvbWlzZTxTY29vcFJlc3VsdD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWluc3RhbGwnLCBhcHApLFxuXG4gIHNjb29wVW5pbnN0YWxsOiAoYXBwOiBzdHJpbmcpOiBQcm9taXNlPFNjb29wUmVzdWx0PiA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnc2Nvb3AtdW5pbnN0YWxsJywgYXBwKSxcblxuICBzY29vcExpc3Q6ICgpOiBQcm9taXNlPFNjb29wUmVzdWx0PiA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWxpc3QnKSxcblxuICBzY29vcFVwZGF0ZTogKGFwcD86IHN0cmluZyk6IFByb21pc2U8U2Nvb3BSZXN1bHQ+ID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzY29vcC11cGRhdGUnLCBhcHApLFxuXG4gIHNjb29wSW5mbzogKGFwcDogc3RyaW5nKTogUHJvbWlzZTxTY29vcFJlc3VsdD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWluZm8nLCBhcHApLFxuXG4gIHNjb29wQnVja2V0TGlzdDogKCk6IFByb21pc2U8U2Nvb3BSZXN1bHQ+ID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzY29vcC1idWNrZXQtbGlzdCcpLFxuXG4gIHNjb29wQnVja2V0QWRkOiAobmFtZTogc3RyaW5nLCByZXBvPzogc3RyaW5nKTogUHJvbWlzZTxTY29vcFJlc3VsdD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWJ1Y2tldC1hZGQnLCBuYW1lLCByZXBvKSxcblxuICBzY29vcEJ1Y2tldFJtOiAobmFtZTogc3RyaW5nKTogUHJvbWlzZTxTY29vcFJlc3VsdD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWJ1Y2tldC1ybScsIG5hbWUpLFxuXG4gIHNjb29wUmVzZXQ6IChhcHA6IHN0cmluZyk6IFByb21pc2U8U2Nvb3BSZXN1bHQ+ID0+XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdzY29vcC1yZXNldCcsIGFwcCksXG5cbiAgc2Nvb3BDbGVhbnVwOiAoYXBwPzogc3RyaW5nKTogUHJvbWlzZTxTY29vcFJlc3VsdD4gPT5cbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ3Njb29wLWNsZWFudXAnLCBhcHApLFxuXG4gIG9wZW5FeHRlcm5hbDogKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PlxuICAgIGlwY1JlbmRlcmVyLmludm9rZSgnb3Blbi1leHRlcm5hbCcsIHVybCksXG5cbiAgc2hvd01lc3NhZ2U6IChvcHRpb25zOiB7XG4gICAgdHlwZTogJ25vbmUnIHwgJ2luZm8nIHwgJ2Vycm9yJyB8ICdxdWVzdGlvbicgfCAnd2FybmluZydcbiAgICB0aXRsZTogc3RyaW5nXG4gICAgbWVzc2FnZTogc3RyaW5nXG4gIH0pOiBQcm9taXNlPHsgcmVzcG9uc2U6IG51bWJlciB9PiA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ3Nob3ctbWVzc2FnZScsIG9wdGlvbnMpLFxufSlcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJleHBvc2VJbk1haW5Xb3JsZCIsImNoZWNrU2Nvb3AiLCJpbnZva2UiLCJzY29vcFNlYXJjaCIsInF1ZXJ5Iiwic2Nvb3BJbnN0YWxsIiwiYXBwIiwic2Nvb3BVbmluc3RhbGwiLCJzY29vcExpc3QiLCJzY29vcFVwZGF0ZSIsInNjb29wSW5mbyIsInNjb29wQnVja2V0TGlzdCIsInNjb29wQnVja2V0QWRkIiwibmFtZSIsInJlcG8iLCJzY29vcEJ1Y2tldFJtIiwic2Nvb3BSZXNldCIsInNjb29wQ2xlYW51cCIsIm9wZW5FeHRlcm5hbCIsInVybCIsInNob3dNZXNzYWdlIiwib3B0aW9ucyJdLCJzb3VyY2VSb290IjoiIn0=