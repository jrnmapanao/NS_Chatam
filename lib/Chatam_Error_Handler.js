/**
 * This is a library module that handles the error messages thrown by the
 * script. Note that you need not put any of the required SS 2.0 annotations for
 * library modules
 */
define([], function() {

	function customLog(e) {
		try {

			// Error in prototype chain for JavaScript errors such as TypeError,
			// RangeError, SyntaxError, etc.
			// JavaScript errors have name, message, stack, fileName, and
			// lineNumber properties.
			// See
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
			if (e instanceof Error) {
				log.debug('JavaScript error', 'name: ' + e.name + '\n'
						+ 'message: ' + e.message + '\n' + 'stack trace: '
						+ e.stack + '\n' + 'fileName: ' + e.fileName + '\n'
						+ 'lineNumber: ' + e.lineNumber);

				// Other errors are likely to be SuiteScript specific.
				// SuiteScript errors have name, message, and stack like
				// JavaScript errors.
				// SuiteScript errors also have id and cause properties.
			} else {
				log.debug('SuiteScript error', 'name: ' + e.name + '\n'
						+ 'message: ' + e.message + '\n' + 'stack trace: '
						+ e.stack + '\n' + 'id: ' + e.id + '\n' + 'cause: '
						+ JSON.stringify(e.cause));
			}
		} catch (e2) {
			log.debug('Error thrown from error handler module', e2);
		}
	}
	return {
		customLog : customLog
	};

});
