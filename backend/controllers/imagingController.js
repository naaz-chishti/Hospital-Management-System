import Imaging from "../models/Imaging.js";

export const createImaging = async (req, res) => {
  try {

    // Generate Next Imaging ID
    const lastImaging = await Imaging.findOne().sort({
      imagingId: -1,
    });

    let imagingId = "IMG0001";

    if (lastImaging && lastImaging.imagingId) {

      const lastNumber = parseInt(
        lastImaging.imagingId.replace("IMG", ""),
        10
      );

      imagingId = `IMG${String(lastNumber + 1).padStart(4, "0")}`;

    }

    console.log("Last Imaging:", lastImaging?.imagingId);
    console.log("Generated Imaging ID:", imagingId);

    const imaging = await Imaging.create({
      ...req.body,
      imagingId,
    });

    const populatedImaging = await Imaging.findById(imaging._id)
      .populate("patient")
      .populate("doctor", "-password")
      .populate("consultation");

    res.status(201).json({
      success: true,
      message: "Imaging created successfully",
      data: populatedImaging,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getImagings =
  async (req, res) => {
    try {

      const imaging =
        await Imaging.find()
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate(
            "consultation"
          );

      res.status(200).json({
        success: true,
        count:
          imaging.length,
        data: imaging
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

  export const getImagingById =
  async (req, res) => {
    try {

      const imaging =
        await Imaging.findById(
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

      if (!imaging) {
        return res.status(404).json({
          success: false,
          message:
            "Imaging record not found"
        });
      }

      res.status(200).json({
        success: true,
        data: imaging
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateImaging =
  async (req, res) => {
    try {

      const imaging =
        await Imaging.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!imaging) {
        return res.status(404).json({
          success: false,
          message:
            "Imaging record not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Imaging updated successfully",
        data: imaging
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteImaging =
  async (req, res) => {
    try {

      const imaging =
        await Imaging.findById(
          req.params.id
        );

      if (!imaging) {
        return res.status(404).json({
          success: false,
          message:
            "Imaging record not found"
        });
      }

      await imaging.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Imaging deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };