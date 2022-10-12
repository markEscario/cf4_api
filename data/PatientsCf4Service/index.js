'use strict';
const config = require('../../config');
const sql = require('mssql');
let bcrypt = require("bcryptjs");
const connError = new Error('Connection Error');
const queryError = new Error('Query Error');

const getPatients = async () => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      const patientsList = await request.query`SELECT * FROM UERMMMC..PATIENTINFO`;
      return patientsList.recordset
    } catch (error) {
      return queryError.message
    }
  } catch (error) {
    return connError.message
  }
}

const searchPatients = async (data) => {
  let filter = `%${data}%`;
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const results = await request.query`SELECT * FROM UERMMMC..PATIENTINFO AS 
      Pt INNER JOIN UERMMMC..CASES AS Cs ON Pt.PATIENTNO = Cs.PATIENTNO LEFT JOIN 
      UERMMMC..CF4_PATIENT_DATA AS Cpd ON Pt.PATIENTNO = Cpd.PATIENT_NO
      WHERE (DATEAD BETWEEN '2022-09-01 00:00:01' AND GETDATE() AND
      Pt.LASTNAME LIKE ${filter}) OR (DATEAD BETWEEN '2022-09-01 00:00:01' AND GETDATE() AND
      Cs.CASENO LIKE ${filter})`;

    return results.recordset;
  } catch (error) {
    return error
  }
}

const getPatientDetails = async (patientNo) => {
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const results = await request.query`SELECT * FROM UERMMMC..PATIENTINFO AS 
      Pt INNER JOIN UERMMMC..CASES AS Cs ON Pt.PATIENTNO = Cs.PATIENTNO
      WHERE DATEAD BETWEEN '2022-09-01 00:00:01' AND GETDATE() AND
      Pt.PATIENTNO = ${patientNo}`;

    return results.recordset;
  } catch (error) {
    return error
  }
}

const createPatientCf4 = async (reqData) => {
  try {
    let patient_no = `${reqData.patient_no}`;
    let case_no = `${reqData.case_no}`;
    let cf4_status = `${reqData.cf4_status}`; 

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()
    try {
      await transaction.begin();
      const cf4 = await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_PATIENT_DATA
        (
        PATIENT_NO,
        CASE_NO,
        CF4_STATUS
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        ${cf4_status}
        )`;
      if (cf4) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'CREATED CF4',
        'CREATE',
        'CF4'
        )`;
      }
      await transaction.commit();
      return "CF4 WAS CREATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const getCf4PatientData = async (patientNo) => {
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const result = await request.query`SELECT * FROM UERMMMC..CF4_PATIENT_DATA 
      WHERE PATIENT_NO = ${patientNo} AND CF4_STATUS != 'DELETED'`;
    return result.recordset;
  } catch (error) {
    return error
  }
}

const getCf4ReasonForAdmission = async (patientNo) => {
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const result = await request.query`SELECT * FROM UERMMMC..CF4_PATIENT_DATA 
      WHERE PATIENT_NO = ${patientNo} AND CF4_STATUS != 'DELETED'`;
    return result.recordset;
  } catch (error) {
    return error
  }
}

const updateCf4PatientData = async (eRequest, pId) => {
  try {
    let patient_no = `${eRequest.patient_no}`;
    let case_no = `${eRequest.case_no}`;
    let chief_complaint = `${eRequest.chief_complaint}`;
    let admitting_diagnosis = `${eRequest.admitting_diagnosis}`;
    let discharge_diagnosis = `${eRequest.discharge_diagnosis}`;
    let a_first_case_rate = `${eRequest.a_first_case_rate}`;
    let a_second_case_rate = `${eRequest.a_second_case_rate}`;
    let cf4_status = 'UPDATED';

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const updateCf4PatientData = await new sql.Request(transaction).query`UPDATE UERMMMC..CF4_PATIENT_DATA
      SET 
      CHIEF_COMPLAINT = ${chief_complaint}, 
      AD_DIAGNOSIS = ${admitting_diagnosis},
      DIS_DIAGNOSIS = ${discharge_diagnosis},
      AFIRST_CASE_RATE = ${a_first_case_rate},
      ASECOND_CASE_RATE = ${a_second_case_rate},
      CF4_STATUS = ${cf4_status}
      WHERE ID = ${pId}`;

      if (updateCf4PatientData) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'CF4 PATIENT DATA',
        'EDIT',
        ${admitting_diagnosis}
        )`;
      }
      await transaction.commit();
      return "DATA WAS UPDATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const updateCf4ReasonForAdmission = async (eRequest, pId) => {
  try {
    let patient_no = `${eRequest.patient_no}`;
    let case_no = `${eRequest.case_no}`;
    let history_of_present_illness = `${eRequest.history_of_present_illness}`;
    let pertinent_past_medical_history = `${eRequest.pertinent_past_medical_history}`;
    let ob_g = `${eRequest.ob_g}`;
    let ob_p = `${eRequest.ob_p}`;
    let ob_1 = `${eRequest.ob_1}`;
    let ob_2 = `${eRequest.ob_2}`;
    let ob_3 = `${eRequest.ob_3}`;
    let ob_4 = `${eRequest.ob_4}`;
    let lmp = `${eRequest.lmp}`;
    let ob_na = `${eRequest.ob_na}`;
    let pertinent_signs_and_symptoms = `${eRequest.pertinent_signs_and_symptoms}`;
    let pain = `${eRequest.pain}`;
    let pain_site = `${eRequest.pain_site}`;
    let psas_other = `${eRequest.psas_other}`;
    let psas_other_desc = `${eRequest.psas_other_desc}`;
    let referred_to_another_hci = `${eRequest.referred_to_another_hci}`;
    let rhci_yes = `${eRequest.rhci_yes}`;
    let rhci_no = `${eRequest.rhci_no}`;
    let specify_reason = `${eRequest.specify_reason}`;
    let originating_hci = `${eRequest.originating_hci}`;
    let general_survey = `${eRequest.general_survey}`;
    let awake_and_alert = `${eRequest.awake_and_alert}`;
    let altered_sensorium = `${eRequest.altered_sensorium}`;
    let altered_sensorium_data = `${eRequest.altered_sensorium_data}`;
    let p_height = `${eRequest.p_height}`;
    let p_weight = `${eRequest.p_weight}`;
    let vital_sign_bp = `${eRequest.vital_sign_bp}`;
    let vital_sign_hr = `${eRequest.vital_sign_hr}`;
    let vital_sign_rr = `${eRequest.vital_sign_rr}`;
    let vital_sign_temp = `${eRequest.vital_sign_temp}`;
    let heent = `${eRequest.heent}`;
    let heent_others = `${eRequest.heent_others}`;
    let chest_lungs = `${eRequest.chest_lungs}`;
    let chest_lungs_others = `${eRequest.chest_lungs_others}`;
    let cvs = `${eRequest.cvs}`;
    let cvs_others = `${eRequest.cvs_others}`;
    let abdomen = `${eRequest.abdomen}`;
    let abdomen_others = `${eRequest.abdomen_others}`;
    let gu = `${eRequest.gu}`;
    let gu_others = `${eRequest.gu_others}`;
    let skin = `${eRequest.skin}`;
    let skin_others = `${eRequest.skin_others}`;
    let neuro_exam = `${eRequest.neuro_exam}`;
    let neuro_exam_others = `${eRequest.neuro_exam_others}`;
    let outcome_of_treatment = `${eRequest.outcome_of_treatment}`;
    let outcome_reason = `${eRequest.outcome_reason}`;
    let cf4_status = 'UPDATED';

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const updateCf4PatientData = await new sql.Request(transaction).query`UPDATE UERMMMC..CF4_PATIENT_DATA
      SET 
      HISTORY_OF_PRESENT_ILLNESS = ${history_of_present_illness},
      PERTINENT_PAST_MEDICAL_HISTORY = ${pertinent_past_medical_history},
      OB_G = ${ob_g},
      OB_P = ${ob_p},
      OB_1 = ${ob_1},
      OB_2 = ${ob_2},
      OB_3 = ${ob_3},
      OB_4 = ${ob_4},
      LMP = ${lmp},
      OB_NA = ${ob_na},
      PERTINENT_SIGNS_AND_SYMPTOMS = ${pertinent_signs_and_symptoms},
      PAIN = ${pain},
      PAIN_SITE = ${pain_site},
      PSAS_OTHER = ${psas_other},
      PSAS_OTHER_DESC = ${psas_other_desc},
      REFERRED_TO_ANOTHER_HCI = ${referred_to_another_hci},
      RHCI_YES = ${rhci_yes},
      RHCI_NO = ${rhci_no},
      SPECIFY_REASON = ${specify_reason},
      ORIGINATING_HCI = ${originating_hci},
      GENERAL_SURVEY = ${general_survey},
      AWAKE_AND_ALERT = ${awake_and_alert},
      ALTERED_SENSORIUM = ${altered_sensorium},
      ALTERED_SENSORIUM_DATA = ${altered_sensorium_data},
      P_HEIGHT = ${p_height},
      P_WEIGHT = ${p_weight},
      VITAL_SIGN_BP = ${vital_sign_bp},
      VITAL_SIGN_HR = ${vital_sign_hr},
      VITAL_SIGN_RR = ${vital_sign_rr},
      VITAL_SIGN_TEMP = ${vital_sign_temp},
      HEENT = ${heent},
      HEENT_OTHERS = ${heent_others},
      CHEST_LUNGS = ${chest_lungs},
      CHEST_LUNGS_OTHERS = ${chest_lungs_others},
      CVS = ${cvs},
      CVS_OTHERS = ${cvs_others},
      ABDOMEN = ${abdomen},
      ABDOMEN_OTHERS = ${abdomen_others},
      GU = ${gu},
      GU_OTHERS = ${gu_others},
      SKIN = ${skin},
      SKIN_OTHERS = ${skin_others},
      NEURO_EXAM = ${neuro_exam},
      NEURO_EXAM_OTHERS = ${neuro_exam_others},
      OUTCOME_OF_TREATMENT = ${outcome_of_treatment},
      OUTCOME_REASON = ${outcome_reason},
      CF4_STATUS = ${cf4_status}
      WHERE ID = ${pId}`;

      if (updateCf4PatientData) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'CF4 REASON FOR ADMISSION',
        'EDIT',
        'UPDATING REASON FOR ADMISSION'
        )`;
      }
      await transaction.commit();
      return "DATA WAS UPDATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const getCf4CourseInTheWard = async (patientNo) => {
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const result = await request.query`SELECT * FROM UERMMMC..CF4_COURSE_IN_THE_AWARD 
      WHERE PATIENT_NO = ${patientNo} AND CIW_STATUS != 'DELETED'`;
    return result.recordset;
  } catch (error) {
    return error
  }
}

const deleteAdDiagnosis = async (eRequest, pId) => {
  try {
    let patient_no = `${eRequest.patient_no}`;
    let case_no = `${eRequest.case_no}`;
    let admitting_diagnosis = `${eRequest.admitting_diagnosis}`;
    let ad_status = `${eRequest.ad_status}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const updateDiagnosis = await new sql.Request(transaction).query`UPDATE UERMMMC..CF4_ADMITTING_DIAGNOSIS
      SET 
      AD_STATUS = ${ad_status}
      WHERE ID = ${pId}`;

      if (updateDiagnosis) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'ADMISSION DIAGNOSIS',
        'DELETE',
        ${admitting_diagnosis}
        )`;
      }
      await transaction.commit();
      return "DATA WAS UPDATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const deletePatientHistory = async (eRequest, pId) => {
  try {
    let patient_no = `${eRequest.patient_no}`;
    let case_no = `${eRequest.case_no}`;
    let history_of_present_illness = `${eRequest.history_of_present_illness}`;
    let hpi_status = `${eRequest.hpi_status}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const deleteHistory = await new sql.Request(transaction).query`UPDATE UERMMMC..CF4_HISTORY_OF_PRESENT_ILLNESS
      SET 
      HPI_STATUS = ${hpi_status}
      WHERE ID = ${pId}`;

      if (deleteHistory) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'HISTORY OF PRESENT ILLNESS',
        'DELETE',
        ${history_of_present_illness}
        )`;
      }
      await transaction.commit();
      return "DATA WAS UPDATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const deletePertinentPastMedicalHistory = async (eRequest, pId) => {
  try {
    let patient_no = `${eRequest.patient_no}`;
    let case_no = `${eRequest.case_no}`;
    let pertinent_past_medical_history = `${eRequest.pertinent_past_medical_history}`;
    let ppmh_status = `${eRequest.ppmh_status}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const deletePPMHistory = await new sql.Request(transaction).query`UPDATE UERMMMC..CF4_PERTINENT_PAST_MEDICAL_HISTORY
      SET 
      PPMH_STATUS = ${ppmh_status}
      WHERE ID = ${pId}`;

      if (deletePPMHistory) {
        await new sql.Request(transaction).query`INSERT INTO UERMMMC..CF4_ACTION_LOGS
        (
        PATIENTNO,
        CASENO,
        MODULE,
        ACTION_TYPE,
        ACTION_DESC
        ) 
        VALUES 
        (
        ${patient_no},
        ${case_no},
        'PERTINENT_PAST_MEDICAL_HISTORY',
        'DELETE',
        ${pertinent_past_medical_history}
        )`;
      }
      await transaction.commit();
      return "DATA WAS UPDATED"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

module.exports = {
  getPatients,
  createPatientCf4,
  getCf4PatientData,
  getCf4ReasonForAdmission,
  getCf4CourseInTheWard,
  searchPatients,
  getPatientDetails,
  updateCf4PatientData,
  updateCf4ReasonForAdmission,
  deleteAdDiagnosis,
  deletePatientHistory,
  deletePertinentPastMedicalHistory
}
