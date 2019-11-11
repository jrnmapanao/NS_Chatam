/**
 * This is a library module contains all the following variables used: - Global --
 * Variable -- Internal IDs
 */

define(
		[],

		function() {

			function isHRRep() {
				return '1008';
			}

			function isHRMan() {
				return '1007';
			}

			function isHRDir() {
				return '1006';
			}

			function isEmployee() {
				return '1009';
			}

			function complStatForApproval() {
				return '3';
			}

			function complStatCompleted() {
				return '4';
			}

			function complStatClosed() {
				return '5';
			}

			function complApprvStatPending() {
				return '1';
			}

			function complApprvStatApproved() {
				return '2';
			}

			function complApprvStatRejected() {
				return '3';
			}

			function complApprvStatNA() {
				return '4';
			}

			function complSeverityLow() {
				return '1';
			}

			function complSeverityMed() {
				return '2';
			}

			function complSeverityHigh() {
				return '3';
			}

			function custRec_complaints_trx() {
				return 'customrecord_trx_complaints';
			}

			function custRec_complaints_severity_fld() {
				return 'custrecord_complaints_field_severity';
			}

			function custRec_complaints_assigned_fld() {
				return 'custrecord_complaint_field_assigned';
			}

			function custRec_complaints_fieldTitle_fld() {
				return 'custrecord_complaint_field_title';
			}

			function custSearch_compl_apprv_track() {
				return 'customsearch_compl_apprv_track';
			}

			function custRec_compl_apprv_complIntl_fld() {
				return 'custrecord_complaint_approver_compintl';
			}

			function custRec_compl_apprv_level_fld() {
				return 'custrecord_complappr_level';
			}

			function custRec_compl_apprv_status_fld() {
				return 'custrecord_complappr_status';
			}

			function custRec_compl_apprv_actdate_fld() {
				return 'custrecord_complappr_actdate';
			}

			function custRec_compl_apprv_approver_fld() {
				return 'custrecord_complappr_approver';
			}

			function custRec_compl_apprv_requestor_fld() {
				return 'custrecord_complappr_requestor';
			}

			function custRec_compl_apprv_task1_fld() {
				return 'custrecord_complaint_task1';
			}

			function custRec_compl_apprv_task2_fld() {
				return 'custrecord_complaint_task2';
			}

			function custRec_compl_apprv_task3_fld() {
				return 'custrecord_complaint_task3';
			}

			function taskRec_status_fld() {
				return 'status';
			}

			function taskRec_status_complete_value() {
				return 'COMPLETE';
			}

			function taskRec_status_progress_value() {
				return 'PROGRESS';
			}

			function custSearch_employee_rec() {
				return 'customsearch_search_employee';
			}

			function custSearch_employee_role_fld() {
				return 'role';
			}

			function custSearch_employee_internalId_fld() {
				return 'entityid';
			}

			function taskRec_priority_low_text() {
				return 'Low';
			}

			function taskRec_priority_medium_text() {
				return 'Medium';
			}

			function taskRec_priority_high_text() {
				return 'High';
			}

			function custRec_compl_apprv_track() {
				return 'customrecord_complaints_approval_tracker';
			}

			function complStatCompleted() {
				return '4';
			}

			function complStatClosed() {
				return '5';
			}

			function custRec_complaints_status_fld() {
				return 'custrecord_complaint_field_status';
			}

			function custpage_approve_proc_fld() {
				return 'custpage_approve_proc';
			}

			function custpage_reject_proc_fld() {
				return 'custpage_reject_proc';
			}

			function cs_script_path() {
				return '/SuiteScripts/Chatam_HRS/Chatam_CS_Complaints_Record';
			}

			function custrecord_complaints_field_forapproval_fld() {
				return 'custrecord_complaints_field_forapproval';
			}

			function custRec_complaints_id_fld() {
				return 'id';
			}

			function customsearch_complaints_role_list() {
				return 'customsearch_complaints_role_list';
			}

			function role_name_fld() {
				return 'name';
			}

			function role_internalid_fld() {
				return 'internalid';
			}

			function custrecord_complaint_field_notes_fld() {
				return 'custrecord_complaint_field_notes';
			}

			function taskrec_priority_fld() {
				return 'priority';
			}

			function taskrec_assigned_fld() {
				return 'assigned';
			}

			function taskrec_title_fld() {
				return 'title';
			}

			function custRec_compl_apprv_internalid_fld() {
				return 'internalid';
			}

			return {
				isHRRep : isHRRep,
				isHRMan : isHRMan,
				isHRDir : isHRDir,
				isEmployee : isEmployee,
				complStatForApproval : complStatForApproval,
				complStatCompleted : complStatCompleted,
				complStatClosed : complStatClosed,
				complApprvStatPending : complApprvStatPending,
				complApprvStatApproved : complApprvStatApproved,
				complApprvStatRejected : complApprvStatRejected,
				complApprvStatNA : complApprvStatNA,
				complSeverityLow : complSeverityLow,
				complSeverityMed : complSeverityMed,
				complSeverityHigh : complSeverityHigh,
				custRec_complaints_trx : custRec_complaints_trx,
				custRec_complaints_severity_fld : custRec_complaints_severity_fld,
				custRec_complaints_assigned_fld : custRec_complaints_assigned_fld,
				custRec_complaints_fieldTitle_fld : custRec_complaints_fieldTitle_fld,
				custSearch_compl_apprv_track : custSearch_compl_apprv_track,
				custRec_compl_apprv_complIntl_fld : custRec_compl_apprv_complIntl_fld,
				custRec_compl_apprv_level_fld : custRec_compl_apprv_level_fld,
				custRec_compl_apprv_status_fld : custRec_compl_apprv_status_fld,
				custRec_compl_apprv_actdate_fld : custRec_compl_apprv_actdate_fld,
				custRec_compl_apprv_approver_fld : custRec_compl_apprv_approver_fld,
				custRec_compl_apprv_requestor_fld : custRec_compl_apprv_requestor_fld,
				custRec_compl_apprv_task1_fld : custRec_compl_apprv_task1_fld,
				custRec_compl_apprv_task2_fld : custRec_compl_apprv_task2_fld,
				custRec_compl_apprv_task3_fld : custRec_compl_apprv_task3_fld,
				taskRec_status_fld : taskRec_status_fld,
				taskRec_status_complete_value : taskRec_status_complete_value,
				taskRec_status_progress_value : taskRec_status_progress_value,
				custSearch_employee_rec : custSearch_employee_rec,
				custSearch_employee_role_fld : custSearch_employee_role_fld,
				custSearch_employee_internalId_fld : custSearch_employee_internalId_fld,
				taskRec_priority_low_text : taskRec_priority_low_text,
				taskRec_priority_medium_text : taskRec_priority_medium_text,
				taskRec_priority_high_text : taskRec_priority_high_text,
				custRec_compl_apprv_track : custRec_compl_apprv_track,
				complStatCompleted : complStatCompleted,
				complStatClosed : complStatClosed,
				custRec_complaints_status_fld : custRec_complaints_status_fld,
				custpage_approve_proc_fld : custpage_approve_proc_fld,
				custpage_reject_proc_fld : custpage_reject_proc_fld,
				cs_script_path : cs_script_path,
				custrecord_complaints_field_forapproval_fld : custrecord_complaints_field_forapproval_fld,
				custRec_complaints_id_fld : custRec_complaints_id_fld,
				customsearch_complaints_role_list : customsearch_complaints_role_list,
				role_name_fld : role_name_fld,
				role_internalid_fld : role_internalid_fld,
				custrecord_complaint_field_notes_fld : custrecord_complaint_field_notes_fld,
				taskrec_priority_fld : taskrec_priority_fld,
				taskrec_assigned_fld : taskrec_assigned_fld,
				taskrec_title_fld : taskrec_title_fld,
				custRec_compl_apprv_internalid_fld : custRec_compl_apprv_internalid_fld

			};

		});
