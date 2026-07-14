import Payment from "../models/Payment.js";

export const createPayment = async (req, res) => {
  try {

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getPayments =
  async (req, res) => {
    try {

      const payments =
        await Payment.find()
          .populate("bill")
          .populate("patient");

      res.status(200).json({
        success: true,
        count:
          payments.length,
        data:
          payments
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getPaymentById =
  async (req, res) => {
    try {

      const payment =
        await Payment.findById(
          req.params.id
        )
          .populate("bill")
          .populate("patient");

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found"
        });
      }

      res.status(200).json({
        success: true,
        data: payment
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updatePayment =
  async (req, res) => {
    try {

      const payment =
        await Payment.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Payment updated successfully",
        data: payment
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deletePayment =
  async (req, res) => {
    try {

      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found"
        });
      }

      await payment.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Payment deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };