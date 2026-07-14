import InsuranceClaim from "../models/InsuranceClaim.js";

export const createClaim =
  async (req, res) => {
    try {

      const count =
        await InsuranceClaim.countDocuments();

      const claim =
        await InsuranceClaim.create({
          ...req.body,

          claimId:
            `CLM${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: claim
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getClaims =
  async (req, res) => {
    try {

      const claims =
        await InsuranceClaim.find()
          .populate("patient")
          .populate("bill");

      res.status(200).json({
        success: true,
        count: claims.length,
        data: claims
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getClaimById =
  async (req, res) => {
    try {

      const claim =
        await InsuranceClaim.findById(
          req.params.id
        )
          .populate("patient")
          .populate("bill");

      if (!claim) {
        return res.status(404).json({
          success: false,
          message:
            "Claim not found"
        });
      }

      res.status(200).json({
        success: true,
        data: claim
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateClaim =
  async (req, res) => {
    try {

      const claim =
        await InsuranceClaim.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!claim) {
        return res.status(404).json({
          success: false,
          message:
            "Claim not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Claim updated successfully",
        data: claim
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteClaim =
  async (req, res) => {
    try {

      const claim =
        await InsuranceClaim.findById(
          req.params.id
        );

      if (!claim) {
        return res.status(404).json({
          success: false,
          message:
            "Claim not found"
        });
      }

      await claim.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Claim deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };