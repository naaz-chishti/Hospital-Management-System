import LabTest from "../models/LabTest.js";

export const createLabTest = async (req, res) => {
  try {

    const lastTest = await LabTest.findOne().sort({ testId: -1 });

    let testId = "LAB0001";

    if (lastTest && lastTest.testId) {

      const lastNumber = parseInt(
        lastTest.testId.replace("LAB", ""),
        10
      );

      testId = `LAB${String(lastNumber + 1).padStart(4, "0")}`;

    }

    console.log("Last Test:", lastTest?.testId);
    console.log("Generated Test ID:", testId);

    const labTest = await LabTest.create({
      ...req.body,
      testId,
    });

    res.status(201).json({
      success: true,
      data: labTest,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getLabTests = async (req, res) => {
  try {

    const tests = await LabTest.find()
      .populate("patient")
      .populate("doctor", "-password")
      .populate("consultation");

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });

  } catch (error) {

    console.log("LAB TEST ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

  export const getLabTestById =
  async (req, res) => {
    try {

      const test =
        await LabTest.findById(
          req.params.id
        )
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate(
            "consultation"
          );

      if (!test) {
        return res.status(404).json({
          success: false,
          message:
            "Lab Test not found"
        });
      }

      res.status(200).json({
        success: true,
        data: test
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

  export const updateLabTest =
  async (req, res) => {
    try {

      const test =
        await LabTest.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!test) {
        return res.status(404).json({
          success: false,
          message:
            "Lab Test not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Lab Test updated successfully",
        data: test
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

  export const deleteLabTest =
  async (req, res) => {
    try {

      const test =
        await LabTest.findById(
          req.params.id
        );

      if (!test) {
        return res.status(404).json({
          success: false,
          message:
            "Lab Test not found"
        });
      }

      await test.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Lab Test deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };