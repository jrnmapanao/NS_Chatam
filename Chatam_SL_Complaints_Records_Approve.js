/**
 * @NApiVersion 2.0
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
				log.debug('SL START', 'SL START');
				var result = null;
				if (context.request.method == 'GET') {
					log.debug('SL START GET', 'SL START GET');
					var request = context.request;
					var recid = request.parameters.recid;

					var complSeverityLow = globalVar.complSeverityLow();
					var complSeverityMed = globalVar.complSeverityMed();
					var complSeverityHigh = globalVar.complSeverityHigh();

					var apprvIsHRRep = globalVar.isHRRep();
					var apprvIsHRMan = globalVar.isHRMan();
					var apprvIsHRDir = globalVar.isHRDir();

					var emailRequestor = false; // OK
					var completeTask = false;

					var addTaskMan = false; // OK
					var addTaskDir = false; // OK

					var emailForApprv = false; // OK
					var updateComplTrack = false; // OK

					var routeComplTrack = false; // OK

					var completed = false; // OK

					if (recid) {
						// Load data
						var complRec = record.load({
							id : recid,
							type : globalVar.custRec_complaints_trx()
						});

						// Get the severity
						var severityVal = complRec.getValue({
							fieldId : globalVar
									.custRec_complaints_severity_fld()
						});

						var assignedTo = complRec.getValue({
							fieldId : globalVar
									.custRec_complaints_assigned_fld()
						});

						log.debug('SL severityVal ', severityVal);

						// MAIN LOGIC
						if (severityVal == complSeverityLow) { // Low
							log.debug('SL complSeverityLow ',
									'SL complSeverityLow ');

							if ((currUserRoleVal == apprvIsHRRep)
									&& (assignedTo == currUserIDVal)) { // Rep
								log.debug('SL ROLE HR REP ', 'SL ROLE HR REP');

								completed = true;
								emailRequestor = true;
								completeTask = true;
								updateComplTrack = true;
							}
						} else if (severityVal == complSeverityMed) { // Medium
							log.debug('SL complSeverityMed ',
									'SL complSeverityMed ');

							if (currUserRoleVal == apprvIsHRMan) { // Manager
								log.debug('SL ROLE HR MAN ', 'SL ROLE HR MAN');

								completed = true;
								emailRequestor = true;
								completeTask = true;
								updateComplTrack = true;
							} else if ((currUserRoleVal == apprvIsHRRep)
									&& (assignedTo == currUserIDVal)) { // Rep
								log.debug('SL ROLE HR REP ', 'SL ROLE HR REP');

								addTaskMan = true;
								emailForApprv = true;
								routeComplTrack = true;

								completeTask = true;
								emailRequestor = true;
								updateComplTrack = true;

							}
						} else if (severityVal == complSeverityHigh) { // Urgent
							log.debug('SL complSeverityHigh ',
									'SL complSeverityHigh ');

							if (currUserRoleVal == apprvIsHRDir) { // Director
								log.debug('SL ROLE HR DIR ', 'SL ROLE HR DIR');

								completed = true;
								emailRequestor = true;
								completeTask = true;
								updateComplTrack = true;
							} else if (currUserRoleVal == apprvIsHRMan) { // Manager
								log.debug('SL ROLE HR MAN ', 'SL ROLE HR MAN');

								emailForApprv = true;
								addTaskDir = true;
								routeComplTrack = true;

								completeTask = true;
								emailRequestor = true;
								updateComplTrack = true;

							} else if ((currUserRoleVal == apprvIsHRRep)
									&& (assignedTo == currUserIDVal)) { // Rep
								log.debug('SL ROLE HR REP ', 'SL ROLE HR REP');

								addTaskMan = true;
								emailForApprv = true;
								routeComplTrack = true;

								completeTask = true;
								emailRequestor = true;
								updateComplTrack = true;
							}
						}

						// LOGIC UTILITIES
						// - 1. Get the requestor email from the Approval
						// tracker list and the internal ID of the current
						// record
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
													.getValue({
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

						var complApprvTrackRec = record.load({
							id : complApprvRecId,
							type : globalVar.custRec_compl_apprv_track()
						});

						var complApprvTrackTask1 = complApprvTrackRec
								.getValue({
									fieldId : globalVar
											.custRec_compl_apprv_task1_fld()
								});

						var complApprvTrackTask2 = complApprvTrackRec
								.getValue({
									fieldId : globalVar
											.custRec_compl_apprv_task2_fld()
								});

						var complApprvTrackTask3 = complApprvTrackRec
								.getValue({
									fieldId : globalVar
											.custRec_compl_apprv_task3_fld()
								});

						log.debug('SL requestorVal', requestorVal);
						log.debug('SL complApprvTrackTask1',
								complApprvTrackTask1);
						log.debug('SL complApprvTrackTask2',
								complApprvTrackTask2);
						log.debug('SL complApprvTrackTask3',
								complApprvTrackTask3);

						// LOGIC IMPLEMENTATION
						// 1. Send email stating the approval to Requestor
						if (emailRequestor == true) {
							log.debug('SL emailRequestor', emailRequestor);
							email
									.send({
										author : currUserIDVal,
										recipients : [ requestorVal ],
										subject : 'Approved - Ticket # '
												+ recid,
										body : 'This is to inform you that a new ticket has been approved on my side. Thanks! - Autogenerated message'
									});
						}

						// 2. Complete Tasks
						if (completeTask == true) {
							log.debug('SL completeTask', completeTask);

							if (complApprvTrackTask1 != '') {
								var task1Rec = record.load({
									id : parseInt(complApprvTrackTask1),
									type : record.Type.TASK
								});

								log.debug('task1Rec ', task1Rec);

								var task1CompleteStatus = task1Rec.setValue({
									fieldId : globalVar.taskRec_status_fld(),
									value : globalVar
											.taskRec_status_complete_value()
								});

								var task1RecId = task1Rec.save();

								log.debug('SL task1RecId ', task1RecId);
							}

							if (complApprvTrackTask2 != '') {
								var task2Rec = record.load({
									id : parseInt(complApprvTrackTask2),
									type : record.Type.TASK
								});

								var task2CompleteStatus = task2Rec.setValue({
									fieldId : globalVar.taskRec_status_fld(),
									value : globalVar
											.taskRec_status_complete_value()
								});

								var task2RecId = task2Rec.save();

								log.debug('SL task2RecId ', task2RecId);
							}

							if (complApprvTrackTask3 != '') {
								var task3Rec = record.load({
									id : parseInt(complApprvTrackTask3),
									type : record.Type.TASK
								});

								var task3CompleteStatus = task3Rec.setValue({
									fieldId : globalVar.taskRec_status_fld(),
									value : globalVar
											.taskRec_status_complete_value()
								});

								var task3RecId = task3Rec.save();

								log.debug('SL task3RecId ', task3RecId);
							}
						}

						// 3. Add Task to Manager
						if (addTaskMan == true) {
							// Search Employee Records to find manager internal
							// ids

							log.debug('SL addTaskMan', addTaskMan);

							var searchEmployeeManRec = search.load({
								id : globalVar.custSearch_employee_rec()
							});

							var searchEmployeeManRoleFilter = search
									.createFilter({
										name : globalVar
												.custSearch_employee_role_fld(),
										operator : search.Operator.ANYOF,
										values : apprvIsHRMan
									});

							searchEmployeeManRec.filters
									.push(searchEmployeeManRoleFilter);

							var employeeId = [];
							var ctrEmployee = 0;
							searchEmployeeManRec
									.run()
									.each(
											function(result) {
												employeeId[ctrEmployee] = result.id;
												log
														.debug(
																'MANAGER employeeId[ctrEmployee]  ',
																employeeId[ctrEmployee]);
												ctrEmployee++;
												return true;
											});

							log.debug('SL addTaskMan ctrEmployee', ctrEmployee);

							// Check the Record Severity for the Task Priority
							// levels
							var prioText;
							if (severityVal == globalVar.complSeverityLow()) {
								prioText = globalVar
										.taskRec_priority_low_text();
							} else if (severityVal == globalVar
									.complSeverityMed()) {
								prioText = globalVar
										.taskRec_priority_medium_text();
							} else if (severityVal == globalVar
									.complSeverityHigh()) {
								prioText = globalVar
										.taskRec_priority_high_text();
							} else {
								prioText = globalVar
										.taskRec_priority_low_text();
							}

							// Check name of the complaint for viewing purposes

							var complTitleText = complRec.getText({
								fieldId : globalVar
										.custRec_complaints_fieldTitle_fld()
							});

							var titleText = 'For your Approval - Ticket # '
									+ recid + ': ' + complTitleText;

							var hrManTaskRec, hrManTaskTitle, hrManTaskPrio, hrManTaskAssigned, hrManTaskStatus;
							var hrTaskManIntlId = []; // Variable Declaration
							// for
							// the task Ids to be stored
							// on the Complaint Approver
							for (var ctrMan = 0; ctrMan < employeeId.length; ctrMan++) {
								hrManTaskRec = record.create({
									type : record.Type.TASK,
									isDynamic : true
								});

								hrManTaskTitle = hrManTaskRec.setText({
									fieldId : globalVar.taskrec_title_fld(),
									text : titleText
								});

								hrManTaskPrio = hrManTaskRec.setText({
									fieldId : globalVar.taskrec_priority_fld(),
									text : prioText
								});

								hrManTaskStatus = hrManTaskRec.setValue({
									fieldId : globalVar.taskRec_status_fld(),
									value : globalVar
											.taskRec_status_progress_value()
								});

								hrManTaskAssigned = hrManTaskRec.setValue({
									fieldId : globalVar.taskrec_assigned_fld(),
									value : employeeId[ctrMan]
								});

								hrTaskManIntlId[ctrMan] = hrManTaskRec.save(); // @todo
								// to
								// check
								// array
								// if
								// empty
								// to
								// throw
								// an
								// error

								log
										.debug(
												'SL addTaskMan hrTaskManIntlId[ctrMan] ',
												hrTaskManIntlId[ctrMan]);
							}

							// Search and update Approver Record to Update Task
							// Details

							var searchManApprvTrackRec = search.load({
								id : globalVar.custSearch_compl_apprv_track()
							});

							var apprvTrackManComplIntlFilter = search
									.createFilter({
										name : globalVar
												.custRec_compl_apprv_complIntl_fld(),
										operator : search.Operator.ANYOF,
										values : recid
									});

							var apprvManTrackLevelFilter = search
									.createFilter({
										name : globalVar
												.custRec_compl_apprv_level_fld(),
										operator : search.Operator.ANYOF,
										values : globalVar.isHRMan()
									});

							searchManApprvTrackRec.filters
									.push(apprvTrackManComplIntlFilter);
							searchManApprvTrackRec.filters
									.push(apprvManTrackLevelFilter);

							var ctrManRec = 0;
							var complManApprvRecId;

							searchManApprvTrackRec
									.run()
									.each(
											function(result) {
												complManApprvRecId = result
														.getValue({
															name : globalVar
																	.custRec_compl_apprv_internalid_fld()
														});

												log
														.debug(
																'SL  addTaskMan complManApprvRecId ',
																complManApprvRecId);

												ctrManRec++;
												return true;
											});

							var complManApprvTrackRec = record.load({
								id : complManApprvRecId,
								type : globalVar.custRec_compl_apprv_track()
							});

							var complManApprvTrack1 = complManApprvTrackRec
									.setText({
										fieldId : globalVar
												.custRec_compl_apprv_task1_fld(),
										text : hrTaskManIntlId[0]
									});

							var complManApprvTrack2 = complManApprvTrackRec
									.setText({
										fieldId : globalVar
												.custRec_compl_apprv_task2_fld(),
										text : hrTaskManIntlId[1]
									});

							complManApprvTrackRec.save();

						}

						// 4. Add Task to Director
						if (addTaskDir == true) {
							log.debug('SL addTaskDir', addTaskDir);
							// Search Employee Records to find manager internal
							// ids

							var searchEmployeeDirRec = search.load({
								id : globalVar.custSearch_employee_rec()
							});

							var searchEmployeeDirRoleFilter = search
									.createFilter({
										name : globalVar
												.custSearch_employee_role_fld(),
										operator : search.Operator.ANYOF,
										values : apprvIsHRDir
									});

							searchEmployeeDirRec.filters
									.push(searchEmployeeDirRoleFilter);

							var employeeId = [];
							var ctrEmployee = 0;
							searchEmployeeDirRec
									.run()
									.each(
											function(result) {
												employeeId[ctrEmployee] = result.id;
												// employeeId[ctrEmployee] =
												// result
												// .getValue({
												// name : globalVar
												// .custSearch_employee_internalId_fld()
												// });

												log
														.debug(
																'SL DIRECTOR employeeId[ctrEmployee]  ',
																employeeId[ctrEmployee]);
												ctrEmployee++;
												return true;
											});

							// Check the Record Severity for the Task Priority
							// levels
							var prioText;
							if (severityVal == globalVar.complSeverityLow()) {
								prioText = globalVar
										.taskRec_priority_low_text();
							} else if (severityVal == globalVar
									.complSeverityMed()) {
								prioText = globalVar
										.taskRec_priority_medium_text();
							} else if (severityVal == globalVar
									.complSeverityHigh()) {
								prioText = globalVar
										.taskRec_priority_high_text();
							} else {
								prioText = globalVar
										.taskRec_priority_low_text();
							}

							// Check name of the complaint for viewing purposes

							var complTitleText = complRec.getText({
								fieldId : globalVar
										.custRec_complaints_fieldTitle_fld()
							});

							var titleText = 'For your Approval - Ticket # '
									+ recid + ': ' + complTitleText;

							var hrDirTaskRec, hrDirTaskTitle, hrDirTaskPrio, hrDirTaskAssigned, hrDirTaskStatus;
							var hrTaskDirIntlId = []; // Variable Declaration
							for (var ctrDir = 0; ctrDir < employeeId.length; ctrDir++) {
								hrDirTaskRec = record.create({
									type : record.Type.TASK,
									isDynamic : true
								});

								hrDirTaskTitle = hrDirTaskRec.setText({
									fieldId : globalVar.taskrec_title_fld(),
									text : titleText
								});

								hrDirTaskPrio = hrDirTaskRec.setText({
									fieldId : globalVar.taskrec_priority_fld(),
									text : prioText
								});

								hrDirTaskStatus = hrDirTaskRec.setValue({
									fieldId : globalVar.taskRec_status_fld(),
									value : globalVar
											.taskRec_status_progress_value()
								});

								hrDirTaskAssigned = hrDirTaskRec.setValue({
									fieldId : globalVar.taskrec_assigned_fld(),
									value : employeeId[ctrDir]
								});

								hrTaskDirIntlId[ctrDir] = hrDirTaskRec.save(); // @todo
								// to
								// check
								// array
								// if
								// empty
								// to
								// throw
								// an
								// error

								log
										.debug(
												'SL addTaskDir hrTaskDirIntlId[ctrDir] ',
												hrTaskDirIntlId[ctrDir]);
							}

							// Search and update Approver Record to Update Task
							// Details

							var searchDirApprvTrackRec = search.load({
								id : globalVar.custSearch_compl_apprv_track()
							});

							var apprvTrackDirComplIntlFilter = search
									.createFilter({
										name : globalVar
												.custRec_compl_apprv_complIntl_fld(),
										operator : search.Operator.ANYOF,
										values : recid
									});

							var apprvDirTrackLevelFilter = search
									.createFilter({
										name : globalVar
												.custRec_compl_apprv_level_fld(),
										operator : search.Operator.ANYOF,
										values : globalVar.isHRDir()
									});

							searchDirApprvTrackRec.filters
									.push(apprvTrackDirComplIntlFilter);
							searchDirApprvTrackRec.filters
									.push(apprvDirTrackLevelFilter);

							var ctrManRec = 0;
							var complDirApprvRecId;

							searchDirApprvTrackRec
									.run()
									.each(
											function(result) {
												complDirApprvRecId = result
														.getValue({
															name : globalVar
																	.custRec_compl_apprv_internalid_fld()
														});

												log
														.debug(
																'SL  addTaskDir complDirApprvRecId ',
																complDirApprvRecId);

												ctrManRec++;
												return true;
											});

							var complDirApprvTrackRec = record.load({
								id : complDirApprvRecId,
								type : globalVar.custRec_compl_apprv_track()
							});

							var complDirApprvTrack1 = complDirApprvTrackRec
									.setText({
										fieldId : globalVar
												.custRec_compl_apprv_task1_fld(),
										text : hrTaskDirIntlId[0]
									});

							complDirApprvTrackRec.save();

						}

						// 5. Email Managers OR Directors for Approval
						// Prereq = EmployeeId Array of the HR Manager and HR
						// Director and complTitleText

						if (emailForApprv == true) {
							log.debug('SL emailForApprv', emailForApprv);
							if (employeeId.length > 0) {
								for (var ctrEmailRec = 0; ctrEmailRec < employeeId.length; ctrEmailRec++) {
									email
											.send({
												author : currUserIDVal,
												recipients : [ employeeId[ctrEmailRec] ],
												cc : [ currUserIDVal ],
												subject : 'For your Approval - Ticket # '
														+ recid
														+ ': '
														+ complTitleText,
												body : 'This is to inform you that a new ticket has been filed and needs your assessment. Thanks! - Autogenerated message' // @todo
											// DO A
											// NICE
											// EMAIL
											// MESSAGE
											});

									log.debug('SL emailForApprv sent to : ',
											employeeId[ctrEmailRec]);
								}

							} else {
								// @todo PUT ERROR MESSAGE THAT NO EMAIL HAS
								// BEEN DETECTED TO THE SYSTEM
							}
						}

						// 6. Complete Complaint Approver Tracker for the
						// Current Approver
						if (updateComplTrack == true) {
							log.debug('SL updateComplTrack', updateComplTrack);

							var complApprvTrackApprover = complApprvTrackRec
									.setValue({
										fieldId : globalVar
												.custRec_compl_apprv_approver_fld(),
										value : currUserIDVal
									});

							var current_date = new Date();
							var format_date = current_date.getDate() + "-"
									+ (current_date.getMonth() + 1) + "-"
									+ current_date.getFullYear(); // dd-mm-yyyy

							log.debug('SL updateComplTrack format_date',
									format_date);

							var complApprvActionDate = complApprvTrackRec
									.setText({
										fieldId : globalVar
												.custRec_compl_apprv_actdate_fld(),
										text : format_date.toString()
									});

							var complApprvStatus = complApprvTrackRec
									.setValue({
										fieldId : globalVar
												.custRec_compl_apprv_status_fld(),
										value : globalVar
												.complApprvStatApproved()
									});

							complApprvTrackRec.save();

						}

						// 7. Route the Complaint Ticket for the next approver
						if (routeComplTrack == true) {
							if (severityVal == complSeverityMed) { // Medium
								if ((currUserRoleVal == apprvIsHRRep)
										&& (assignedTo == currUserIDVal)) { // Rep

									log.debug('SL routeComplTrack ',
											'ROUTE TO MANAGER');

									var searchManApprvTrackRec = search.load({
										id : globalVar
												.custSearch_compl_apprv_track()
									});

									var apprvTrackManComplIntlFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_complIntl_fld(),
												operator : search.Operator.ANYOF,
												values : recid
											});

									var apprvManTrackLevelFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_level_fld(),
												operator : search.Operator.ANYOF,
												values : globalVar.isHRMan()
											});

									searchManApprvTrackRec.filters
											.push(apprvTrackManComplIntlFilter);
									searchManApprvTrackRec.filters
											.push(apprvManTrackLevelFilter);

									var ctrManRec = 0;
									var complManApprvRecId;

									searchManApprvTrackRec
											.run()
											.each(
													function(result) {
														complManApprvRecId = result
																.getValue({
																	name : globalVar
																			.custRec_compl_apprv_internalid_fld()
																});

														log
																.debug(
																		'SL routeComplTrack (MEDIUM LEVEL SEVERITY) complManApprvRecId ',
																		complManApprvRecId);

														ctrManRec++;
														return true;
													});

									var complManApprvTrackRec = record.load({
										id : complManApprvRecId,
										type : globalVar
												.custRec_compl_apprv_track()
									});

									var complManApprvTrackStatus = complManApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_status_fld(),
												value : globalVar
														.complApprvStatPending()
											});

									var complManApprvTrackRequestor = complManApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_requestor_fld(),
												value : currUserIDVal
											});

									complManApprvTrackRec.save();

								}
							} else if (severityVal == complSeverityHigh) { // Urgent
								if (currUserRoleVal == apprvIsHRMan) { // Manager
									log.debug('SL routeComplTrack ',
											'ROUTE TO DIRECTOR');

									var searchDirApprvTrackRec = search.load({
										id : globalVar
												.custSearch_compl_apprv_track()
									});

									var apprvTrackDirComplIntlFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_complIntl_fld(),
												operator : search.Operator.ANYOF,
												values : recid
											});

									var apprvDirTrackLevelFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_level_fld(),
												operator : search.Operator.ANYOF,
												values : globalVar.isHRDir()
											});

									searchDirApprvTrackRec.filters
											.push(apprvTrackDirComplIntlFilter);
									searchDirApprvTrackRec.filters
											.push(apprvDirTrackLevelFilter);

									var ctrDirRec = 0;
									var complDirApprvRecId;

									searchDirApprvTrackRec
											.run()
											.each(
													function(result) {
														complDirApprvRecId = result
																.getValue({
																	name : globalVar
																			.custRec_compl_apprv_internalid_fld()
																});

														log
																.debug(
																		'SL routeComplTrack (urgent LEVEL SEVERITY) complManApprvRecId ',
																		complDirApprvRecId);

														ctrDirRec++;
														return true;
													});

									var complDirApprvTrackRec = record.load({
										id : complDirApprvRecId,
										type : globalVar
												.custRec_compl_apprv_track()
									});

									var complDirApprvTrackStatus = complDirApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_status_fld(),
												value : globalVar
														.complApprvStatPending()
											});

									var complDirApprvTrackRequestor = complDirApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_requestor_fld(),
												value : currUserIDVal
											});

									complDirApprvTrackRec.save();

								} else if ((currUserRoleVal == apprvIsHRRep)
										&& (assignedTo == currUserIDVal)) { // Rep
									log.debug('SL routeComplTrack ',
											'ROUTE TO MANAGER');

									var searchManApprvTrackRec = search.load({
										id : globalVar
												.custSearch_compl_apprv_track()
									});

									var apprvTrackManComplIntlFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_complIntl_fld(),
												operator : search.Operator.ANYOF,
												values : recid
											});

									var apprvManTrackLevelFilter = search
											.createFilter({
												name : globalVar
														.custRec_compl_apprv_level_fld(),
												operator : search.Operator.ANYOF,
												values : globalVar.isHRMan()
											});

									searchManApprvTrackRec.filters
											.push(apprvTrackManComplIntlFilter);
									searchManApprvTrackRec.filters
											.push(apprvManTrackLevelFilter);

									var ctrManRec = 0;
									var complManApprvRecId;

									searchManApprvTrackRec
											.run()
											.each(
													function(result) {
														complManApprvRecId = result
																.getValue({
																	name : globalVar
																			.custRec_compl_apprv_internalid_fld()
																});

														log
																.debug(
																		'SL routeComplTrack (URGENT LEVEL SEVERITY) complManApprvRecId ',
																		complManApprvRecId);

														ctrManRec++;
														return true;
													});

									var complManApprvTrackRec = record.load({
										id : complManApprvRecId,
										type : globalVar
												.custRec_compl_apprv_track()
									});

									var complManApprvTrackStatus = complManApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_status_fld(),
												value : globalVar
														.complApprvStatPending()
											});

									var complManApprvTrackRequestor = complManApprvTrackRec
											.setValue({
												fieldId : globalVar
														.custRec_compl_apprv_requestor_fld(),
												value : currUserIDVal
											});

									complManApprvTrackRec.save();

								}
							}

						}

						// 8. Mark as completed
						if (completed == true) {
							log.debug('SL completed ', completed);
							var complStatusVal = complRec.setValue({
								fieldId : globalVar
										.custRec_complaints_status_fld(),
								value : globalVar.complStatCompleted()
							});

							log.debug('SL completed saveRecord ', saveRecord);
						}

						// Update the Complaints Approval Field to save Notes
						// @todo

					}

					var saveRecord = complRec.save();
				}
			}

			return {
				onRequest : onRequest
			};

		});
