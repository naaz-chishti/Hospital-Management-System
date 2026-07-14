import Bill from "../models/Bill.js";

export const createBill = async (req, res) => {

try {

const lastBill = await Bill.findOne().sort({ createdAt: -1 });

let billId = "BILL0001";

if (lastBill) {

const lastNumber = parseInt(
lastBill.billId.replace("BILL", ""),
10
);

billId = `BILL${String(lastNumber + 1).padStart(4, "0")}`;

}

const totalAmount =

Number(req.body.consultationFee || 0) +
Number(req.body.labFee || 0) +
Number(req.body.imagingFee || 0) +
Number(req.body.admissionFee || 0) +
Number(req.body.medicineFee || 0);

const bill = await Bill.create({

...req.body,

billId,

totalAmount,

});

res.status(201).json({

success:true,

data:bill,

});

} catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}

};

export const getBills =
  async (req, res) => {
    try {

      const bills =
        await Bill.find()
          .populate("patient");

      res.status(200).json({
        success: true,
        count:
          bills.length,
        data: bills
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const getBillById =
  async (req, res) => {
    try {

      const bill =
        await Bill.findById(
          req.params.id
        ).populate(
          "patient"
        );

      if (!bill) {
        return res.status(404).json({
          success: false,
          message:
            "Bill not found"
        });
      }

      res.status(200).json({
        success: true,
        data: bill
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const updateBill =
  async (req, res) => {
    try {

      const bill =
        await Bill.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!bill) {
        return res.status(404).json({
          success: false,
          message:
            "Bill not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Bill updated successfully",
        data: bill
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

export const deleteBill =
  async (req, res) => {
    try {

      const bill =
        await Bill.findById(
          req.params.id
        );

      if (!bill) {
        return res.status(404).json({
          success: false,
          message:
            "Bill not found"
        });
      }

      await bill.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Bill deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };