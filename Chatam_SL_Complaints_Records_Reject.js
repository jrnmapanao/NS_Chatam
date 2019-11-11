/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(
		[ 'N/record', 'N/search', 'N/email', 'N/runtime',
				'./lib/Chatam_Global_Variables', 'N/redirect', 'N/url' ],

		function(record, search, email, runtime, globalVar, redirect, url) {

			/**
			 * Definition of the Suitelet script trigger point.
			 * 
			 * @param {Object}
			 *            context
			 * @param {ServerRequest}
			 *            context.request - Encapsulation of the incoming
			 *            request
			 * @param {ServerResponse}
			 *            context.response - Encapsulation of the Suitelet
			 *            response
			 * @Since 2015.2
			 */

			var currUser = runtime.getCurrentUser();
			var currUserRoleVal = currUser.role;
			var currUserNameText = currUser.name;
			var currUserIDVal = currUser.id;

			function onRequest(context) {
				var result = null;
				if (context.request.method == 'GET') {

					var request = context.request;
					var recid = request.parameters.recid;

					var complSeverityLow = globalVar.complSeverityLow();
					var complSeverityMed = globalVar.complSeverityMed();
					var complSeverityHigh = globalVar.complSeverityHigh();

					var apprvIsHRRep = globalVar.isHRRep();
					var apprvIsHRMan = globalVar.isHRMan();
					var apprvIsHRDir = globalVar.isHRDir();

					if (recid) {
						// Search the Approval ticket with the same Record ID
						// and the
						// same Role ID
						// Then mark it as rejected (sublist) and close the
						// ticket (Main
						// Record)
						// Update the task and mark complete
						// Notify Requestor for Reject Status

						var searchApprvTrackRec = search.load({
							id : globalVar.custSearch_compl_apprv_track()
						});

						var apprvTrackComplIntlFilter = search.createFilter({
							name : globalVar
									.custRec_compl_apprv_complIntl_fld(),
							operator : search.Operator.ANYOF,
							values : recid
						});

						var apprvTrackLevelFilter = search.createFilter({
							name : globalVar.custRec_compl_apprv_level_fld(),
							operator : search.Operator.ANYOF,
							values : currUserRoleVal
						});

						searchApprvTrackRec.filters
								.push(apprvTrackComplIntlFilter);
						searchApprvTrackRec.filters.push(apprvTrackLevelFilter);

						var requestorVal = '';
						var complApprvRecId = '';

						searchApprvTrackRec
								.run()
								.each(
										function(result) {
											requestorVal = result
													.getValue({ // @TODO
														// REQUESTOR VAL
														// FOR EMAIL
														name : globalVar
																.custRec_compl_apprv_requestor_fld()
													});

											complApprvRecId = result
													.getValue({
														name : globalVar
																.custRec_compl_apprv_internalid_fld()
													});
											return true;
										});

						log.debug('SL complApprvRecId ', complApprvRecId);

						// Setting the Approval Tracker to Rejected Status
						var complApprvTrackRec = record.load({
							id : complApprvRecId,
							type : globalVar.custRec_compl_apprv_track()
						});

						var task1 = complApprvTrackRec.getValue({
							fieldId : globalVar.custRec_compl_apprv_task1_fld()
						});

						var task2 = complApprvTrackRec.getValue({
							fieldId : globalVar.custRec_compl_apprv_task2_fld()
						});

						var task3 = complApprvTrackRec.getValue({
							fieldId : globalVar.custRec_compl_apprv_task3_fld()
						});

						var complApprvTrack = complApprvTrackRec.setValue({
							fieldId : globalVar
									.custRec_compl_apprv_status_fld(),
							value : globalVar.complApprvStatRejected()
						});

						var complApprvTrackRecSave = complApprvTrackRec.save();
						log.debug('SL R complApprvTrackRecSave ',
								complApprvTrackRecSave);

						log.debug('SL task1 ', task1);
						log.debug('SL task2 ', task2);
						log.debug('SL task3 ', task3);

						// Setting the Complaint Ticket to Closed
						var complTrxRec = record.load({
							id : recid,
							type : globalVar.custRec_complaints_trx()
						});

						var complTrxStatClosed = complTrxRec
								.setValue({
									fieldId : globalVar
											.custRec_complaints_status_fld(),
									value : globalVar.complStatClosed()
								});

						var saveTrxRecord = complTrxRec.save();
						log.debug('SL R saveTrxRecord ', saveTrxRecord);

						// Update the task and Mark as complete
						if (task1 != '') {
							var task1Rec = record.load({
								id : parseInt(task1),
								type : record.Type.TASK
							});
							log.debug('task1Rec ', task1Rec);

							var task1CompleteStatus = task1Rec.setValue({
								fieldId : globalVar.taskRec_status_fld(),
								value : globalVar
										.taskRec_status_complete_value()
							});

							var task1RecId = task1Rec.save();

							log.debug('SL R task1RecId ', task1RecId);

						}

						if (task2 != '') {
							var task2Rec = record.load({
								id : parseInt(task2),
								type : record.Type.TASK
							});

							log.debug('task2Rec ', task2Rec);

							var task2CompleteStatus = task2Rec.setValue({
								fieldId : globalVar.taskRec_status_fld(),
								value : globalVar
										.taskRec_status_complete_value()
							});

							var task2RecId = task2Rec.save();

							log.debug('SL R task2RecId ', task2RecId);

						}

						if (task3 != '') {
							var task3Rec = record.load({
								id : parseInt(task3),
								type : record.Type.TASK
							});

							log.debug('task3Rec ', task3Rec);

							var task3CompleteStatus = task3Rec.setValue({
								fieldId : globalVar.taskRec_status_fld(),
								value : globalVar
										.taskRec_status_complete_value()
							});

							var task3RecId = task3Rec.save();

							log.debug('SL R task3RecId ', task3RecId);

						}

						// Email
						email
								.send({
									author : currUserIDVal,
									recipients : [ requestorVal ],
									subject : 'Rejected - Ticket # ' + recid,
									body : 'This is to inform you that a new ticket has been approved on my side. Thanks! - Autogenerated message'
								});

					}

				}

			}

			return {
				onRequest : onRequest
			};

		});
