/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.ts":
/*!*************************!*\
  !*** ./worker/index.ts ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("self.addEventListener('push', (event)=>{\n    const data = event.data?.json() ?? {};\n    const title = data.title || 'Нове повідомлення';\n    const options = {\n        body: data.body || 'Перевірте ваш щоденник',\n        icon: '/icon-192x192.png',\n        badge: '/icon-192x192.png',\n        data: {\n            url: data.url || '/'\n        }\n    };\n    event.waitUntil(self.registration.showNotification(title, options));\n});\nself.addEventListener('notificationclick', (event)=>{\n    event.notification.close();\n    event.waitUntil(self.clients.matchAll({\n        type: 'window'\n    }).then((clientList)=>{\n        const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;\n        for (const client of clientList){\n            if (client.url === urlToOpen && 'focus' in client) {\n                return client.focus();\n            }\n        }\n        if (self.clients.openWindow) {\n            return self.clients.openWindow(urlToOpen);\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXgudHMiLCJtYXBwaW5ncyI6IkFBRUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQ0M7SUFDN0IsTUFBTUMsT0FBT0QsTUFBTUMsSUFBSSxFQUFFQyxVQUFVLENBQUM7SUFDcEMsTUFBTUMsUUFBUUYsS0FBS0UsS0FBSyxJQUFJO0lBQzVCLE1BQU1DLFVBQVU7UUFDZEMsTUFBTUosS0FBS0ksSUFBSSxJQUFJO1FBQ25CQyxNQUFNO1FBQ05DLE9BQU87UUFDUE4sTUFBTTtZQUNKTyxLQUFLUCxLQUFLTyxHQUFHLElBQUk7UUFDbkI7SUFDRjtJQUNBUixNQUFNUyxTQUFTLENBQUNYLEtBQUtZLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNSLE9BQU9DO0FBQzVEO0FBRUFOLEtBQUtDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDQztJQUMxQ0EsTUFBTVksWUFBWSxDQUFDQyxLQUFLO0lBQ3hCYixNQUFNUyxTQUFTLENBQ2JYLEtBQUtnQixPQUFPLENBQUNDLFFBQVEsQ0FBQztRQUFFQyxNQUFNO0lBQVMsR0FBR0MsSUFBSSxDQUFDLENBQUNDO1FBQzlDLE1BQU1DLFlBQVksSUFBSUMsSUFBSXBCLE1BQU1ZLFlBQVksQ0FBQ1gsSUFBSSxDQUFDTyxHQUFHLEVBQUVWLEtBQUt1QixRQUFRLENBQUNDLE1BQU0sRUFBRUMsSUFBSTtRQUNqRixLQUFLLE1BQU1DLFVBQVVOLFdBQVk7WUFDL0IsSUFBSU0sT0FBT2hCLEdBQUcsS0FBS1csYUFBYSxXQUFXSyxRQUFRO2dCQUNqRCxPQUFPQSxPQUFPQyxLQUFLO1lBQ3JCO1FBQ0Y7UUFDQSxJQUFJM0IsS0FBS2dCLE9BQU8sQ0FBQ1ksVUFBVSxFQUFFO1lBQzNCLE9BQU81QixLQUFLZ0IsT0FBTyxDQUFDWSxVQUFVLENBQUNQO1FBQ2pDO0lBQ0Y7QUFFSiIsInNvdXJjZXMiOlsiL1VzZXJzL3JvbWFuL0Rlc2t0b3AvY2Fsb3JpZS93b3JrZXIvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBsZXQgc2VsZjogU2VydmljZVdvcmtlckdsb2JhbFNjb3BlXG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIChldmVudCkgPT4ge1xuICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YT8uanNvbigpID8/IHt9XG4gIGNvbnN0IHRpdGxlID0gZGF0YS50aXRsZSB8fCAn0J3QvtCy0LUg0L/QvtCy0ZbQtNC+0LzQu9C10L3QvdGPJ1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGJvZHk6IGRhdGEuYm9keSB8fCAn0J/QtdGA0LXQstGW0YDRgtC1INCy0LDRiCDRidC+0LTQtdC90L3QuNC6JyxcbiAgICBpY29uOiAnL2ljb24tMTkyeDE5Mi5wbmcnLFxuICAgIGJhZGdlOiAnL2ljb24tMTkyeDE5Mi5wbmcnLFxuICAgIGRhdGE6IHtcbiAgICAgIHVybDogZGF0YS51cmwgfHwgJy8nXG4gICAgfVxuICB9XG4gIGV2ZW50LndhaXRVbnRpbChzZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKHRpdGxlLCBvcHRpb25zKSlcbn0pXG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKClcbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIHNlbGYuY2xpZW50cy5tYXRjaEFsbCh7IHR5cGU6ICd3aW5kb3cnIH0pLnRoZW4oKGNsaWVudExpc3QpID0+IHtcbiAgICAgIGNvbnN0IHVybFRvT3BlbiA9IG5ldyBVUkwoZXZlbnQubm90aWZpY2F0aW9uLmRhdGEudXJsLCBzZWxmLmxvY2F0aW9uLm9yaWdpbikuaHJlZlxuICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgY2xpZW50TGlzdCkge1xuICAgICAgICBpZiAoY2xpZW50LnVybCA9PT0gdXJsVG9PcGVuICYmICdmb2N1cycgaW4gY2xpZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGNsaWVudC5mb2N1cygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzZWxmLmNsaWVudHMub3BlbldpbmRvdykge1xuICAgICAgICByZXR1cm4gc2VsZi5jbGllbnRzLm9wZW5XaW5kb3codXJsVG9PcGVuKVxuICAgICAgfVxuICAgIH0pXG4gIClcbn0pXG4iXSwibmFtZXMiOlsic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwidGl0bGUiLCJvcHRpb25zIiwiYm9keSIsImljb24iLCJiYWRnZSIsInVybCIsIndhaXRVbnRpbCIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb24iLCJjbG9zZSIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJ0aGVuIiwiY2xpZW50TGlzdCIsInVybFRvT3BlbiIsIlVSTCIsImxvY2F0aW9uIiwib3JpZ2luIiwiaHJlZiIsImNsaWVudCIsImZvY3VzIiwib3BlbldpbmRvdyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./worker/index.ts\n"));

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
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				if (!originalFactory) {
/******/ 					document.location.reload();
/******/ 					return;
/******/ 				}
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.ts");
/******/ 	
/******/ })()
;