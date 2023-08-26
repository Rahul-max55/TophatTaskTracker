import Attendence from '../models/Attendence.js';
import User from '../models/User.js';
import { validateObjectId } from '../utils/validation.js';

// get specific attendence
export const getAllAttendence = async (req, res) => {
  try {
    if (req.accessType === 'admin') {
      const employeeId = (
        await User.findOne({ email: req.body.email })
      )._id.toString();
      const data = await Attendence.find({ userId: employeeId });
      res.status(200).json({ data, status: true });
    }
    if (req.accessType === 'employee') {
      const data = await Attendence.find({ userId: req.user._id });
      res.status(200).json({ data, status: true });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: `${err.message}` });
  }
};

// mark an attendence
export const markAttendence = async (req, res) => {
  try {
    const { userId, date, markedBy, description } = req.body;
    // userId - (_id) of the person's who's attendence is marked

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: 'User Id not found' });
    }

    if (!validateObjectId(userId)) {
      return res
        .status(400)
        .json({ status: false, message: 'User Id not valid' });
    }

    if (!date) {
      return res.status(400).json({ status: false, message: 'Date not found' });
    }

    if (!markedBy) {
      return res
        .status(400)
        .json({ status: false, message: 'Marked by not found' });
    }

    // check if the attendence existed
    const findAttendence = await Attendence.findOne({ userId, date });

    if (findAttendence) {
      return res.status(400).json({
        status: false,
        message: `Attendence for date ${date} is already marked`,
      });
    }

    const attendence = await Attendence.create({
      userId,
      date,
      markedBy,
      description,
    });
    res.status(200).json({
      attendence,
      status: true,
      message: 'Attendence marked successfully',
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: `${error.message}` });
  }
};

// get a particular attendence (by _id)
export const singleAttendence = async (req, res) => {
  try {
    const id = req.params.attendenceId;

    if (!validateObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: 'Attendence Id not valid' });
    }

    if (!id) {
      return res.status(400).json({ status: false, message: 'Id not found' });
    }

    const data = await Attendence.findById(id);
    return res.status(200).json({ data, status: true });
  } catch (error) {
    return res.status(500).json({ status: false, message: `${error.message}` });
  }
};

// update attendence
export const updateAttendence = async (req, res) => {
  try {
    if (!validateObjectId(req.params.attendenceId)) {
      return res
        .status(400)
        .json({ status: false, message: 'Attendence Id not valid' });
    }

    let attendence = await Attendence.findById(req.params.attendenceId);

    if (!attendence) {
      return res
        .status(400)
        .json({ status: false, message: 'Attendence with given id not found' });
    }

    attendence = await Attendence.findByIdAndUpdate(
      req.params.attendenceId,
      { ...req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ status: true, message: 'Attendence updated successfully..' });
  } catch (error) {
    return res.status(500).json({ status: false, message: `${error.message}` });
  }
};

// delete attendence
export const deleteAttendence = async (req, res) => {
  try {
    if (!validateObjectId(req.params.attendenceId)) {
      return res
        .status(400)
        .json({ status: false, message: 'Attendence Id not valid' });
    }

    let attendence = await Attendence.findById(req.params.attendenceId);

    if (!attendence) {
      return res
        .status(400)
        .json({ status: false, message: 'Attendence with given id not found' });
    }

    //   deleting an attendence
    let removeAttendence = await Attendence.findByIdAndDelete(
      req.params.attendenceId
    );
    res
      .status(200)
      .json({ status: true, message: 'Attendence deleted successfully..' });
  } catch (error) {
    return res.status(500).json({ status: false, message: `${error.message}` });
  }
};
