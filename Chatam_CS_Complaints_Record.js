/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(
		[ 'N/currentRecord', 'N/runtime', 'N/record', 'N/search',
				'N/ui/dialog', 'N/url', 'N/http', 'N/https',
				'./lib/Chatam_Global_Variables' ],
		/**
		 * @param {record}
		 *            record
		 * @param {runtime}
		 *            runtime
		 */
		function(curRecord, runtime, record, search, dialog, url, http, https,
				globalVar) {

			/**
			 * Function to be executed after page is initialized.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.mode - The mode in which the record is
			 *            being accessed (create, copy, or edit)
			 * 
			 * @since 2015.2
			 */

			// Global Variables
			var currUser = runtime.getCurrentUser();
			var currUserRoleVal = currUser.role;

			function pageInit(scriptContext) {
				// if (scriptContext.mode != 'create') {
				// var presentRec = scriptContext.currentRecord;
				// var currUser = runtime.getCurrentUser();
				// var currUserRoleVal = currUser.role;
				// var currUserNameText = currUser.name;
				//
				// var apprvTrackerRec = record.load({
				// id : assignedToVal,
				// type : record.Type.EMPLOYEE
				// });
				//
				// }

			}

			function onApproveClick() {
				// dialog.alert('APPROVED SAMPLE!', 'SAMPLE');
				var presentRec = curRecord.get();
				var presentRecId = presentRec.id;
				console.log('presentRecId ' + presentRecId);
				var suiteUrl = url.resolveScript({
					scriptId : 'customscript_chatam_sl_complaint_rec_app',
					deploymentId : 'customdeploy_chatam_sl_complaint_rec_app',
					returnExternalUrl : false,
					params : {
						'recid' : presentRecId
					}
				});

				console.log('suiteUrl: ' + suiteUrl);

				var response = https.get({
					url : suiteUrl
				});
				
				location.reload();

			}

			function onRejectClick() {
				// dialog.alert('REJECTED CLICKED!', 'SAMPLE');
				
				var presentRec = curRecord.get();
				var presentRecId = presentRec.id;
				console.log('presentRecId ' + presentRecId);
				var suiteUrl = url.resolveScript({
					scriptId : 'customscript_chatam_sl_complaint_rec_rej',
					deploymentId : 'customdeploy_chatam_sl_complaint_rec_rej',
					returnExternalUrl : false,
					params : {
						'recid' : presentRecId
					}
				});

				console.log('suiteUrl: ' + suiteUrl);

				var response = https.get({
					url : suiteUrl
				});
				
				location.reload();
			}

			/**
			 * Function to be executed when field is changed.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * @param {string}
			 *            scriptContext.fieldId - Field name
			 * @param {number}
			 *            scriptContext.lineNum - Line number. Will be undefined
			 *            if not a sublist or matrix field
			 * @param {number}
			 *            scriptContext.columnNum - Line number. Will be
			 *            undefined if not a matrix field
			 * 
			 * @since 2015.2
			 */
			function fieldChanged(scriptContext) {
				var complRec = scriptContext.currentRecord;
				var complApproveReq = complRec.getValue({
					fieldId : 'custrecord_complaints_field_forapproval'
				});

				debugger;
				var complStatusField = complRec.getField({
					fieldId : 'custrecord_complaint_field_status'
				});

				var complS = complRec.getValue({
					fieldId : 'custrecord_complaint_field_status'
				});
				if (complApproveReq == true) {
					complStatusField.isDisplay = false;
				} else {
					complStatusField.isDisplay = true;
				}
				return true;
			}

			/**
			 * Function to be executed when field is slaved.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * @param {string}
			 *            scriptContext.fieldId - Field name
			 * 
			 * @since 2015.2
			 */
			function postSourcing(scriptContext) {

			}

			/**
			 * Function to be executed after sublist is inserted, removed, or
			 * edited.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * 
			 * @since 2015.2
			 */
			function sublistChanged(scriptContext) {

			}

			/**
			 * Function to be executed after line is selected.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * 
			 * @since 2015.2
			 */
			function lineInit(scriptContext) {

			}

			/**
			 * Validation function to be executed when field is changed.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * @param {string}
			 *            scriptContext.fieldId - Field name
			 * @param {number}
			 *            scriptContext.lineNum - Line number. Will be undefined
			 *            if not a sublist or matrix field
			 * @param {number}
			 *            scriptContext.columnNum - Line number. Will be
			 *            undefined if not a matrix field
			 * 
			 * @returns {boolean} Return true if field is valid
			 * 
			 * @since 2015.2
			 */
			function validateField(scriptContext) {

			}

			/**
			 * Validation function to be executed when sublist line is
			 * committed.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * 
			 * @returns {boolean} Return true if sublist line is valid
			 * 
			 * @since 2015.2
			 */
			function validateLine(scriptContext) {

			}

			/**
			 * Validation function to be executed when sublist line is inserted.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * 
			 * @returns {boolean} Return true if sublist line is valid
			 * 
			 * @since 2015.2
			 */
			function validateInsert(scriptContext) {

			}

			/**
			 * Validation function to be executed when record is deleted.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @param {string}
			 *            scriptContext.sublistId - Sublist name
			 * 
			 * @returns {boolean} Return true if sublist line is valid
			 * 
			 * @since 2015.2
			 */
			function validateDelete(scriptContext) {

			}

			/**
			 * Validation function to be executed when record is saved.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.currentRecord - Current form record
			 * @returns {boolean} Return true if record is valid
			 * 
			 * @since 2015.2
			 */
			function saveRecord(scriptContext) {
				var presentRec = scriptContext.currentRecord;

				var statusVal = presentRec.getValue({
					fieldId : 'custrecord_complaint_field_status'
				});
				
				var statCompleted = globalVar.complStatCompleted();
				var statClosed = globalVar.complStatClosed();
				
				log.debug('statCompleted ', statCompleted );
				log.debug('statClosed ', statClosed );
				log.debug('statusVal ', statusVal );
				
				console.log(statCompleted);
				console.log(statClosed);
				console.log(statusVal);

				if ((statusVal == statCompleted)
						|| (statusVal == statClosed)) {
					var messageNotSaved = {
						title : 'Record Not Valid!',
						message : 'Completed and Closed status are not valid for manual override.'
					};
					
					function success(result) { console.log('Success with value: ' + result); return false; }
			        function failure(reason) { console.log('Failure: ' + reason); return false; }

					dialog.alert(messageNotSaved).then(success).catch(failure);
					// return false;
				}else {
					return true;
				}

			}

			return {
				pageInit : pageInit,
				fieldChanged : fieldChanged,
				onApproveClick : onApproveClick,
				onRejectClick : onRejectClick,
				// postSourcing : postSourcing,
				// sublistChanged : sublistChanged,
				// lineInit : lineInit,
				// validateField : validateField,
				// validateLine : validateLine,
				// validateInsert : validateInsert,
				// validateDelete : validateDelete,
				saveRecord : saveRecord
			};

		});
