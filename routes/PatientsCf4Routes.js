'use strict';

const express = require('express');
const router = express.Router();
const PatientsCf4Controller = require('../controllers/PatientsCf4Controller');

router.get('/patients', PatientsCf4Controller.getPatients);
router.get('/search_patients', PatientsCf4Controller.searchPatients)
router.get('/patient_details', PatientsCf4Controller.patientDetails)

// CF4 Patient Data
router.post('/create_patient_cf4', PatientsCf4Controller.createPatientCf4);
router.get('/cf4_patient_data', PatientsCf4Controller.getCf4PatientData);
router.put('/update_cf4_patient_data/:id', PatientsCf4Controller.updateCf4PatientData);

// CF4 Reason For Admission
router.get('/cf4_reason_for_admission', PatientsCf4Controller.getCf4ReasonForAdmission);
router.put('/update_cf4_reason_for_admission/:id', PatientsCf4Controller.updateCf4ReasonForAdmission);

// Course In The Ward
router.get('/cf4_course_in_the_ward', PatientsCf4Controller.getCf4CourseInTheWard);
router.post('/create_cf4_course_in_the_ward', PatientsCf4Controller.createCf4CourseInTheWard);

router.put('/patients/:id', PatientsCf4Controller.updatePatients)
router.put('/update_pertinent_past_medical_history/:id', PatientsCf4Controller.updatePertinentPastMedicalHistory)
router.put('/delete_admitting_diagnosis/:id', PatientsCf4Controller.deleteAdDiagnosis)
router.put('/delete_history_of_present_illness/:id', PatientsCf4Controller.deleteHistory)
router.put('/delete_pertinent_past_medical_history/:id', PatientsCf4Controller.deletePertinentPastMedicalHistory)

module.exports = {
  routes: router
}