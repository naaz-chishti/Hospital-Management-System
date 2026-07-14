import InpatientNote from "../models/InpatientNote.js";

export const createInpatientNote =
  async (req, res) => {
    try {

      const count =
        await InpatientNote.countDocuments();

      const note =
        await InpatientNote.create({
          ...req.body,

          noteId:
            `NOTE${String(
              count + 1
            ).padStart(4, "0")}`
        });

      res.status(201).json({
        success: true,
        data: note
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getInpatientNotes =
  async (req, res) => {
    try {

      const notes =
        await InpatientNote.find()
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate("admission");

      res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const getInpatientNoteById =
  async (req, res) => {
    try {

      const note =
        await InpatientNote.findById(
          req.params.id
        )
          .populate("patient")
          .populate(
            "doctor",
            "-password"
          )
          .populate("admission");

      if (!note) {
        return res.status(404).json({
          success: false,
          message:
            "Inpatient Note not found"
        });
      }

      res.status(200).json({
        success: true,
        data: note
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const updateInpatientNote =
  async (req, res) => {
    try {

      const note =
        await InpatientNote.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument:
              "after",
            runValidators: true
          }
        );

      if (!note) {
        return res.status(404).json({
          success: false,
          message:
            "Inpatient Note not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Inpatient Note updated successfully",
        data: note
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

export const deleteInpatientNote =
  async (req, res) => {
    try {

      const note =
        await InpatientNote.findById(
          req.params.id
        );

      if (!note) {
        return res.status(404).json({
          success: false,
          message:
            "Inpatient Note not found"
        });
      }

      await note.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Inpatient Note deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };