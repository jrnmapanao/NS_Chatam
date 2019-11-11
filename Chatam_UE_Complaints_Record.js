/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(
		[ 'N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search', 'N/task',
				'N/email', './lib/Chatam_Global_Variables', 'N/ui/dialog' ],
		/**
		 * @param {record}
		 *            record
		 * @param {serverWidget}
		 *            serverWidget
		 */
		function(record, serverWidget, runtime, search, task, email, globalVar) {

			/**
			 * Function definition to be triggered before record is loaded.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.newRecord - New record
			 * @param {string}
			 *            scriptContext.type - Trigger type
			 * @param {Form}
			 *            scriptContext.form - Current form
			 * @Since 2015.2
			 */

			// Global Variable
			var currUser = runtime.getCurrentUser();
			var currUserRoleVal = currUser.role;
			var currUserNameText = currUser.name;
			var currUserIDVal = currUser.id;
			var complForApproval = globalVar.complStatForApproval();
			var complApprvStatPending = globalVar.complApprvStatPending();

			function beforeLoad(scriptContext) {

				var currForm = scriptContext.form;

				// Add Button for Approve and Reject Buttons
				var approveButton = currForm.addButton({
					id : globalVar.custpage_approve_proc_fld(),
					label : 'Approve',
					functionName : 'onApproveClick'
				});

				approveButton.isHidden = true;

				var rejectButton = currForm.addButton({
					id : globalVar.custpage_reject_proc_fld(),
					label : 'Reject',
					functionName : 'onRejectClick'
				});

				rejectButton.isHidden = true;
				currForm.clientScriptModulePath = globalVar.cs_script_path();

				if (/*
					 * (runtime.executionContext =
					 * runtime.ContextType.USER_INTERFACE)
					 */(scriptContext.type == scriptContext.UserEventType.EDIT)) {

					var curRecord = scriptContext.newRecord;
					var curRecFieldList = curRecord.getFields();

					var reqApproveVal = curRecord.getValue({
						fieldId : globalVar
								.custrecord_complaints_field_forapproval_fld()
					});

					var complStatusVal = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_status_fld()
					});

					var complIntlId = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_id_fld()
					});

					// Check if the Status is For Approval and that the Required
					// Approval field is set to true
					if (reqApproveVal == true
							|| complStatusVal == complForApproval) {

						log.debug('currUser ', currUser);
						log.debug('currUserRoleVal ', currUserRoleVal);
						log.debug('currUserNameText ', currUserNameText);
						log.debug('currUserIDVal ', currUserIDVal);

						// Search the Approval Tracker Saved Search - find the
						// status
						var searchApprvTrackRec = search.load({
							id : globalVar.custSearch_compl_apprv_track()
						});

						var apprvTrackComplIntlFilter = search.createFilter({
							name : globalVar
									.custRec_compl_apprv_complIntl_fld(),
							operator : search.Operator.ANYOF,
							values : complIntlId
						});

						var apprvTrackStatusFilter = search.createFilter({
							name : globalVar.custRec_compl_apprv_status_fld(),
							operator : search.Operator.ANYOF,
							values : complApprvStatPending
						});

						searchApprvTrackRec.filters
								.push(apprvTrackStatusFilter);
						searchApprvTrackRec.filters
								.push(apprvTrackComplIntlFilter);

						var apprvTrackLevelRec, apprvTrackApproverRec;
						var ctrRec = 0;

						searchApprvTrackRec
								.run()
								.each(
										function(result) {
											apprvTrackLevelRec = result
													.getValue({
														name : globalVar
																.custRec_compl_apprv_level_fld()
													});

											apprvTrackApproverRec = result
													.getValue({
														name : globalVar
																.custRec_compl_apprv_approver_fld()
													});

											log.debug('apprvTrackLevelRec ',
													apprvTrackLevelRec);
											log.debug('apprvTrackApproverRec ',
													apprvTrackApproverRec);

											ctrRec++;
											return true;
										});

						var hrRepRoleVal = globalVar.isHRRep();

						// Actual Conditions to Enable of fields

						if (ctrRec > 0) {
							if (parseFloat(apprvTrackLevelRec) == parseFloat(currUserRoleVal)) {
								if (parseFloat(apprvTrackLevelRec) == parseFloat(hrRepRoleVal)) {
									if (parseFloat(apprvTrackApproverRec) == parseFloat(currUserIDVal)) {
										// For HR Representatives only because
										// of the predefined values
										approveButton.isHidden = false;
										rejectButton.isHidden = false;
									} else {
										approveButton.isHidden = true;
										rejectButton.isHidden = true;
									}
								} else {
									approveButton.isHidden = false;
									rejectButton.isHidden = false;
								}

							}
						}

						// Disable the fields if button not detected
						if ((approveButton.isHidden == true)
								&& (rejectButton.isHidden == true)
								&& (complStatusVal == complForApproval)) {
							var curFormFieldsRec = curRecord.getFields();
							var curField, fieldDisable;
							for (var ctrDisableFields = 0; ctrDisableFields < curFormFieldsRec.length; ctrDisableFields++) {
								curField = curFormFieldsRec[ctrDisableFields];
								fieldDisable = scriptContext.form
										.getField(curField);
								if (fieldDisable) {
									fieldDisable
											.updateDisplayType({
												displayType : serverWidget.FieldDisplayType.DISABLED
											});
								}
							}

						}
					}
				}
			}

			/**
			 * Function definition to be triggered before record is loaded.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.newRecord - New record
			 * @param {Record}
			 *            scriptContext.oldRecord - Old record
			 * @param {string}
			 *            scriptContext.type - Trigger type
			 * @Since 2015.2
			 */
			function beforeSubmit(scriptContext) {

				if (scriptContext.type == scriptContext.UserEventType.EDIT) {
					log.debug('UE BeforeSubmit 1', 'UE BeforeSubmit 1');

					var curRecord = scriptContext.newRecord;

					// Complaints Record Severity Value
					var severityValue = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_severity_fld()
					});
					log.debug('severityValue ', severityValue);

					// Complaints Record ID
					var recordID = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_id_fld()
					});
					log.debug('recordID ', recordID);

					// Complaints Record Assigned To Value
					var assignedToVal = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_assigned_fld()
					});
					log.debug('assignedToVal ', assignedToVal);

					// Complaints Record Requires Approval Checkbox Value
					var reqApproveVal = curRecord.getValue({
						fieldId : globalVar
								.custrecord_complaints_field_forapproval_fld()
					});
					log.debug('reqApproveVal ', reqApproveVal);

					// Get the Record Status Value
					var statusGetValue = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_status_fld()
					});
					log.debug('statusGetValue ', statusGetValue);

					// Use Case: Before save, search if there are existing
					// records on the
					// Complaints approval list. If there's an existing records,
					// return
					var searchComplApprvRec = search.load({
						id : globalVar.custSearch_compl_apprv_track()
					});

					var searchComplApprvFilter = search.createFilter({
						name : globalVar.custRec_compl_apprv_complIntl_fld(),
						operator : search.Operator.ANYOF,
						values : recordID
					});

					searchComplApprvRec.filters.push(searchComplApprvFilter);

					var ctrComplAppr = 0;
					searchComplApprvRec.run().each(function(result) {
						ctrComplAppr++;
						return true;
					});
					log.debug('ctrComplAppr ', ctrComplAppr);

					if (ctrComplAppr > 0) {
						return;
					}

					// Save Role Internal ID as Array
					var roleNameArray = [];
					var roleIntlIdArray = [];

					var ctrRec = 1;
					var searchRoleRecs = search.load({
						id : globalVar.customsearch_complaints_role_list(),
						type : search.Type.ROLE
					});

					searchRoleRecs.run().each(function(result) {
						roleNameArray[ctrRec] = result.getValue({
							name : globalVar.role_name_fld()
						});

						roleIntlIdArray[ctrRec] = result.getValue({
							name : globalVar.role_internalid_fld()
						});
						ctrRec++;

						return true;
					});

					// Add fields to the approver sublist given the severity
					// status
					// - Use Loop
					if ((reqApproveVal == true)
							|| (statusGetValue == complForApproval)) {

						log.debug('UE BeforeSubmit 2 ', 'UE BeforeSubmit 2');

						// Set the value of the status to For Approval
						var compStatusVal = curRecord
								.setValue({
									fieldId : globalVar
											.custRec_complaints_status_fld(),
									value : complForApproval
								});

						var apprvTrackRec, callId, apprvTrackLevel, apprvTrackStat, apprvTrackCompIntl, apprvTrackReq, apprvTrackApprover;
						for (var ctr = 1; ctr <= parseInt(severityValue); ctr++) {
							apprvTrackRec = record.create({
								type : globalVar.custRec_compl_apprv_track(),
								isDynamic : true
							});

							apprvTrackLevel = apprvTrackRec.setValue({
								fieldId : globalVar
										.custRec_compl_apprv_level_fld(),
								value : roleIntlIdArray[ctr]
							});

							apprvTrackCompIntl = apprvTrackRec.setValue({
								fieldId : globalVar
										.custRec_compl_apprv_complIntl_fld(),
								value : recordID
							});

							if (ctr == 1) { // For HR Rep Only

								apprvTrackApprover = apprvTrackRec
										.setValue({
											fieldId : globalVar
													.custRec_compl_apprv_approver_fld(),
											value : assignedToVal
										});

								apprvTrackStat = apprvTrackRec.setValue({
									fieldId : globalVar
											.custRec_compl_apprv_status_fld(),
									value : globalVar.complApprvStatPending()
								});

								apprvTrackReq = apprvTrackRec
										.setValue({
											fieldId : globalVar
													.custRec_compl_apprv_requestor_fld(),
											value : currUserIDVal

										});
							} else {
								apprvTrackStat = apprvTrackRec.setValue({
									fieldId : globalVar
											.custRec_compl_apprv_status_fld(),
									value : globalVar.complApprvStatNA()
								});
							}

							callId = apprvTrackRec.save();

							callId = undefined;
							apprvTrackLevel = undefined;
							apprvTrackStat = undefined;
							apprvTrackCompIntl = undefined;
							apprvTrackReq = undefined;
							apprvTrackApprover = undefined;
						}

						// Check if Notes Fields has values
						var notesText = curRecord.getText({
							fieldId : globalVar
									.custrecord_complaint_field_notes_fld()
						});

						if (notesText == '') {
							notesPutText = curRecord
									.setText({
										fieldId : globalVar
												.custrecord_complaint_field_notes_fld(),
										text : 'N/A'
									});
						}
					}

				}
			}

			/**
			 * Function definition to be triggered before record is loaded.
			 * 
			 * @param {Object}
			 *            scriptContext
			 * @param {Record}
			 *            scriptContext.newRecord - New record
			 * @param {Record}
			 *            scriptContext.oldRecord - Old record
			 * @param {string}
			 *            scriptContext.type - Trigger type
			 * @Since 2015.2
			 */
			function afterSubmit(scriptContext) {
				var curRecord = scriptContext.newRecord;

				// Complaints Record Requires Approval Checkbox Value
				var reqApproveVal = curRecord.getValue({
					fieldId : globalVar
							.custrecord_complaints_field_forapproval_fld()
				});
				log.debug('reqApproveVal ', reqApproveVal);

				// Get the Record Status Value
				var statusGetValue = curRecord.getValue({
					fieldId : globalVar.custRec_complaints_status_fld()
				});
				log.debug('statusGetValue ', statusGetValue);

				if ((reqApproveVal == true)
						|| (statusGetValue == complForApproval)) {
					var recordID = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_id_fld()
					});

					log.debug('AS recordID ', recordID);

					var severityValue = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_severity_fld()
					});

					var prioText;
					if (severityValue == globalVar.complSeverityLow()) {
						prioText = globalVar.taskRec_priority_low_text();
					} else if (severityValue == globalVar.complSeverityMed()) {
						prioText = globalVar.taskRec_priority_medium_text();
					} else if (severityValue == globalVar.complSeverityHigh()) {
						prioText = globalVar.taskRec_priority_high_text();
					} else {
						prioText = globalVar.taskRec_priority_low_text();
					}

					log.debug('AS severityValue ', severityValue);

					var assignedToVal = curRecord.getValue({
						fieldId : globalVar.custRec_complaints_assigned_fld()
					});

					var complTitleText = curRecord.getText({
						fieldId : globalVar.custRec_complaints_fieldTitle_fld()
					});
					log.debug('AS assignedToVal ', assignedToVal);

					var titleText = 'For your Approval - Ticket # ' + recordID
							+ ': ' + complTitleText;

					// Creation of Tasks for HR REP only
					// Search the Complaint Approver List and Proceed if there's
					// no entry with same record id and HR Rep @todo ONLY

					var searchApprvTrackRec = search.load({
						id : globalVar.custSearch_compl_apprv_track()
					});

					var apprvTrackComplIntlFilter = search.createFilter({
						name : globalVar.custRec_compl_apprv_complIntl_fld(),
						operator : search.Operator.ANYOF,
						values : recordID
					});

					var apprvTrackLevelFilter = search.createFilter({
						name : globalVar.custRec_compl_apprv_level_fld(),
						operator : search.Operator.ANYOF,
						values : globalVar.isHRRep()
					});

					var apprvTrackStatusFilter = search.createFilter({
						name : globalVar.custRec_compl_apprv_status_fld(),
						operator : search.Operator.ANYOF,
						values : globalVar.complApprvStatPending()
					});

					searchApprvTrackRec.filters.push(apprvTrackComplIntlFilter);
					searchApprvTrackRec.filters.push(apprvTrackLevelFilter);
					searchApprvTrackRec.filters.push(apprvTrackStatusFilter);

					var ctrRep = 0;
					searchApprvTrackRec.run().each(function(result) {
						ctrRep++;
						return true;
					});

					log.debug('UE AfterSubmit ctrRep', ctrRep);

					if (ctrRep > 0) {
						var hrRepTaskRec = record.create({
							type : record.Type.TASK,
							isDynamic : true
						});

						var hrRepTaskTitle = hrRepTaskRec.setText({
							fieldId : globalVar.taskrec_title_fld(),
							text : titleText
						});

						var hrRepTaskPrio = hrRepTaskRec.setText({
							fieldId : globalVar.taskrec_priority_fld(),
							text : prioText
						});

						var hrRepTaskStatus = hrRepTaskRec.setValue({
							fieldId : globalVar.taskRec_status_fld(),
							value : globalVar.taskRec_status_progress_value()
						});

						var hrRepTaskAssigned = hrRepTaskRec.setValue({
							fieldId : globalVar.taskrec_assigned_fld(),
							value : assignedToVal
						});

						var hrRepSaveTask = hrRepTaskRec.save();

						log.debug('AS hrRepSaveTask ', hrRepSaveTask);

						// Search the Complaints Approver Records to find the
						// specific
						// record for the record update
						// Before save, search if there are existing records on
						// the
						// Complaints approval list
						var searchComplApprvRec = search.load({
							id : globalVar.custSearch_compl_apprv_track()
						});

						var searchApprvComplFilter = search.createFilter({
							name : globalVar
									.custRec_compl_apprv_complIntl_fld(),
							operator : search.Operator.ANYOF,
							values : recordID
						});

						var searchApprvStatFilter = search.createFilter({
							name : globalVar.custRec_compl_apprv_status_fld(),
							operator : search.Operator.ANYOF,
							values : globalVar.complApprvStatPending()
						// Pending Status
						});

						searchComplApprvRec.filters
								.push(searchApprvComplFilter);
						searchComplApprvRec.filters.push(searchApprvStatFilter);

						var complApprvRec;
						searchComplApprvRec
								.run()
								.each(
										function(result) {

											log.debug('MERON HERE ',
													'MERON HERE');
											complApprvRec = result
													.getValue({
														name : globalVar
																.custRec_compl_apprv_internalid_fld()
													});

											log.debug('AS complApprvRec ',
													complApprvRec);
											return true;
										});

						// Load the Complaints Approver Record to update the
						// task1
						// field
						var complApprvTrackRec = record.load({
							id : complApprvRec,
							type : globalVar.custRec_compl_apprv_track()
						});

						complApprvTrackTrk1Val = complApprvTrackRec
								.setText({
									fieldId : globalVar
											.custRec_compl_apprv_task1_fld(),
									text : hrRepSaveTask
								});

						complApprvTrackRec.save();

						// Send Email from Requester to approver
						// currUserIDVal

						email
								.send({
									author : currUserIDVal,
									recipients : [ assignedToVal ],
									cc : [ currUserIDVal ],
									subject : 'For your Approval - Ticket # '
											+ recordID + ': ' + complTitleText,
									body : 'This is to inform you that a new ticket has been filed and needs your assessment. Thanks! - Autogenerated message' // @todo
								// DO A
								// NICE
								// EMAIL
								// MESSAGE
								});

					}

				}

			}

			return {
				beforeLoad : beforeLoad,
				beforeSubmit : beforeSubmit,
				afterSubmit : afterSubmit
			};

		});
