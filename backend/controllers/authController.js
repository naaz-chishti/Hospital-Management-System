import bcrypt from "bcryptjs";

import User from "../models/User.js";

import generateToken
from "../utils/generateToken.js";

export const register = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;

    const userExists =
      await User.findOne({
        email
      });

    if (userExists) {
      return res.status(400)
        .json({
          success: false,
          message:
            "User already exists"
        });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role
      });

    res.status(201).json({
      success: true,
      token:
        generateToken(
          user._id
        ),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }
};

export const login = async (
  req,
  res
) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

      

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401)
        .json({
          success: false,
          message:
            "Invalid credentials"
        });
    }

    res.status(200).json({
      success: true,
      token:
        generateToken(
          user._id
        ),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }
};