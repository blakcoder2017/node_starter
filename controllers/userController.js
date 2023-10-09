const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appErrors');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((elm) => {
    if (allowedFields.includes(elm)) newObject[elm] = obj[elm];
  });
  return newObject;
};

exports.getAllUser = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'sucess',
    data: users,
  });
};

exports.updateMe = async (req, res, next) => {
  //1. create error if your posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. please use /updateMyPassword instead',
        400
      )
    );
  }

  //2. filtered out fields we do not want to update
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3. udpate user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
