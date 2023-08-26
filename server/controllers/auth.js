import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../utils/token.js';
import { validateEmail } from '../utils/validation.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, msg: 'Please enter all details!!' });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, msg: 'This email is not registered!!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, msg: 'Password incorrect!!' });

    const token = createAccessToken({ id: user._id });
    delete user.password;
    res
      .status(200)
      .json({ token, user, status: true, msg: 'Login successful..' });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: 'Internal Server Error' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const access = req.accessType;
    if (access === 'employee') {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to perform this task' });
    }
    const { name, email, password, accessType } = req.body;
    if (!name || !email || !password || !accessType) {
      return res.status(400).json({ msg: 'Please enter all the fields' });
    }
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof accessType !== 'string'
    ) {
      return res.status(400).json({ msg: 'Please send string values only' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'Password length must be atleast 6 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: 'Invalid Email' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'This email is already registered' });
    }

    if (accessType !== 'employee' && accessType !== 'admin') {
      return res
        .status(400)
        .json({ msg: 'Cannot create user with this access type' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, accessType });
    res
      .status(200)
      .json({ msg: 'Congratulations!! Account has been created for you..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
