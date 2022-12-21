import Activity from '../models/Activity.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
const createActivity = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;
  const activity = await Activity.create(req.body);
  res.status(StatusCodes.CREATED).json({ activity });
};
const getAllActivities = async (req, res) => {
  const { status, activityType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (activityType && activityType !== 'all') {
    queryObject.activityType = activityType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }
  // NO AWAIT

  let result = Activity.find(queryObject);

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const activities = await result;

  const totalActivities = await Activity.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalActivities / limit);

  res.status(StatusCodes.OK).json({ activities, totalActivities, numOfPages });
};
const updateActivity = async (req, res) => {
  const { id: activityId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  const activity = await Activity.findOne({ _id: activityId });

  if (!activity) {
    throw new NotFoundError(`No activity with id :${activityId}`);
  }
  // check permissions

  checkPermissions(req.user, activity.createdBy);

  const updatedActivity = await Activity.findOneAndUpdate({ _id: activityId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedActivity });
};
const deleteActivity = async (req, res) => {
  const { id: activityId } = req.params;

  const activity = await Activity.findOne({ _id: activityId });

  if (!activity) {
    throw new NotFoundError(`No activity with id :${activityId}`);
  }

  checkPermissions(req.user, activity.createdBy);

  await activity.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Activity removed' });
};
const showStats = async (req, res) => {
  let stats = await Activity.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Activity.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createActivity, deleteActivity, getAllActivities, updateActivity, showStats };
