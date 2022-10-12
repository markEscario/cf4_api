'use strict';
const patientsCf4Service = require('../data/PatientsCf4Service');
const config = require("../Token/auth.config");

const getPatients = async (req, res) => {
  try {
    const doctors = await patientsCf4Service.getPatients();
    res.send(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const searchPatients = async (req, res) => {
  try {
    let data = req.query.searchData

    const results = await patientsCf4Service.searchPatients(data);
    res.send(results);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const patientDetails = async (req, res) => {
  try {
    let patientNo = req.query.patientNo
  
    const results = await patientsCf4Service.getPatientDetails(patientNo);
    res.send(results);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const createAdDiagnosis = async (req, res) => {
  try {
    let reqData = req.body;

    const addAdDiagnosis = await patientsCf4Service.createAdDiagnosis(reqData);
    res.send(addAdDiagnosis);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const createPatientCf4 = async (req, res) => {
  try {
    let reqData = req.body;

    const cf4 = await patientsCf4Service.createPatientCf4(reqData);
    res.send(cf4);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const getCf4PatientData = async (req, res) => {
  try {
    let patientNo = req.query.patientNo

    const cf4PatientData = await patientsCf4Service.getCf4PatientData(patientNo);
    res.send(cf4PatientData);
  } catch (error) {
  res.status(400).send(error.message);
  }
}

const getCf4ReasonForAdmission = async (req, res) => {
  try {
    let patientNo = req.query.patientNo

    const cf4PatientData = await patientsCf4Service.getCf4ReasonForAdmission(patientNo);
    res.send(cf4PatientData);
  } catch (error) {
  res.status(400).send(error.message);
  }
}

const getCf4CourseInTheWard = async (req, res) => {
  try {
    let patientNo = req.query.patientNo

    const cf4CourseInTheWard = await patientsCf4Service.getCf4CourseInTheWard(patientNo);
    res.send(cf4CourseInTheWard);
  } catch (error) {
  res.status(400).send(error.message);
  }
}

const updateCf4PatientData = async (req, res) => {
  try {
    console.log('param: ', req.params.id)
    let pId = req.params.id;
    let eRequest = req.body;

    const editAdDiagnosis = await patientsCf4Service.updateCf4PatientData(eRequest, pId);
    res.send(editAdDiagnosis);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const updateCf4ReasonForAdmission = async (req, res) => {
  try {
    console.log('param: ', req.params.id)
    let pId = req.params.id;
    let eRequest = req.body;

    const editReasonForAdmission = await patientsCf4Service.updateCf4ReasonForAdmission(eRequest, pId);
    res.send(editReasonForAdmission);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deleteAdDiagnosis = async (req, res) => {
  try {
    console.log('d param: ', req.params.id)
    let pId = req.params.id;
    let eRequest = req.body;

    const deleteAdDiagnosis = await patientsCf4Service.deleteAdDiagnosis(eRequest, pId);
    res.send(deleteAdDiagnosis);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const adDiagnosisEntries = async (req, res) => {
  try {
    let patientNo = req.query.patientNo

    const adDiagnosisEntries = await patientsCf4Service.getAdDiagnosisEntries(patientNo);
    res.send(adDiagnosisEntries);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const historyOfPresentIllnessEntries = async (req, res) => {
  try {
    let patientNo = req.query.patientNo

    const patientHistories = await patientsCf4Service.historyOfPresentIllnessEntries(patientNo);
    res.send(patientHistories);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const updatePertinentPastMedicalHistory = async (req, res) => {
  try {
    console.log('param: ', req.params.id)
    let hId = req.params.id;
    let eRequest = req.body;

    const updatePPMHistory = await patientsCf4Service.updatePertinentPastMedicalHistory(eRequest, hId);
    res.send(updatePPMHistory);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deleteHistory = async (req, res) => {
  try {
    console.log('d param: ', req.params.id)
    let hId = req.params.id;
    let eRequest = req.body;

    const deletePatientHistory = await patientsCf4Service.deletePatientHistory(eRequest, hId);
    res.send(deletePatientHistory);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deletePertinentPastMedicalHistory = async (req, res) => {
  try {
    console.log('d param: ', req.params.id)
    let hId = req.params.id;
    let eRequest = req.body;

    const deletePPMHistory = await patientsCf4Service.deletePertinentPastMedicalHistory(eRequest, hId);
    res.send(deletePPMHistory);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const updatePatients = async (req, res) => {
  try {
    let dCode = req.params.id;
    let dRequest = req.body;

    const doctors = await patientsCf4Service.updatePatients(dRequest, dCode);
    res.send(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  getPatients,
  searchPatients,
  patientDetails,
  getCf4PatientData,
  getCf4ReasonForAdmission,
  getCf4CourseInTheWard,
  createPatientCf4,
  createAdDiagnosis,
  updateCf4PatientData,
  updateCf4ReasonForAdmission,
  deleteAdDiagnosis,
  adDiagnosisEntries,
  updatePatients,
  historyOfPresentIllnessEntries,
  deleteHistory,
  updatePertinentPastMedicalHistory,
  deletePertinentPastMedicalHistory
}