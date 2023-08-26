import Task from "../models/Task.js";
import { validateObjectId } from "../utils/validation.js";

export const getTasks = async (req, res) => {
  try {
    if (req.accessType === "employee") {
      const tasks = await Task.find({ email: req.user.email });
      res
        .status(200)
        .json({ tasks, status: true, msg: "Tasks found successfully..." });
    }
    if (req.accessType === "admin") {
      const tasks = await Task.find();
      const tasksByUserEmail = {};
      tasks.forEach((task) => {
        if (!(task.email in tasksByUserEmail)) {
          tasksByUserEmail[task.email] = [task];
          return;
        }
        tasksByUserEmail[task.email] = [...tasksByUserEmail[task.email], task];
      });
      res.status(200).json({
        tasks: tasksByUserEmail,
        status: true,
        msg: "Tasks of all users found...",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

export const postTask = async (req, res) => {
  try {
    const { description, email } = req.body;
    if (!description) {
      return res
        .status(400)
        .json({ status: false, msg: "Description of task not found" });
    }
    const task = await Task.create({ email, description });
    res
      .status(200)
      .json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", errBody: err });
  }
};

export const putTask = async (req, res) => {
  console.log(req.user);
  try {
    if (
      !Object.hasOwn(req.body, "start") &&
      !Object.hasOwn(req.body, "end") &&
      !Object.hasOwn(req.body, "pause") &&
      !Object.hasOwn(req.body, "description")
    ) {
      return res.status(400).json({ status: false, msg: "No Update Found" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(400)
        .json({ status: false, msg: "Task with given id not found" });
    }

    if (task.email != req.user.email) {
      if (req.user.accessType !== "admin") {
        return res.status(403).json({
          status: false,
          msg: "You can't update task of another user",
        });
      }
    }

    if (req.body.resume) {
      // breaks
      const resumeTime = req.body.resume;
      const pauseTime = task.pause;
      console.log(resumeTime);
      const timeTaken = (new Date(resumeTime) - new Date(pauseTime));

      const T = await Task.findById(req.params.taskId);
      await T.breaks.push(timeTaken);
      await T.save()
      console.log(pauseTime);
      console.log(timeTaken);
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { ...req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(400)
        .json({ status: false, msg: "Task with given id not found" });
    }

    if (task.email != req.user.email) {
      if (req.user.accessType !== "admin") {
        return res.status(403).json({
          status: false,
          msg: "You can't delete task of another user",
        });
      }
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
