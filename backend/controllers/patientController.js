import Patient from "../models/Patient.js";

export const createPatient = async (req, res) => {
  try {
   const lastPatient =
  await Patient.findOne()
    .sort({ createdAt: -1 });

let patientId = "PAT0001";

if (lastPatient) {

  const lastNumber =
    parseInt(
      lastPatient.patientId.replace(
        "PAT",
        ""
      )
    );

  patientId =
    `PAT${String(
      lastNumber + 1
    ).padStart(4, "0")}`;
}

const patient =
  await Patient.create({
    ...req.body,
    patientId
  });

    const response = {
      patientId: patient.patientId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      dob: patient.dob.toISOString().split("T")[0],
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory
    };

    res.status(201).json({
      success: true,
      data: response
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-createdAt -updatedAt");

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select("-createdAt -updatedAt");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
   const patient =
  await Patient.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      returnDocument: "after",
      runValidators: true
    }
  );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};