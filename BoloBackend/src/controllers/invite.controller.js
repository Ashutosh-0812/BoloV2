const Invite = require('../models/Invite');
const response = require('../utils/response');

exports.sendInvite = async (req, res) => {
  try {
    const { participantID } = req.body;
    if (!participantID) return response.error(res, 'participantID required', 400);
    const invite = await Invite.create({ userID: req.user._id, participantID });
    response.success(res, invite, 201);
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to send invite');
  }
};

exports.respondInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body; // accepted or declined
    const invite = await Invite.findById(inviteId);
    if (!invite) return response.error(res, 'Invite not found', 404);
    if (req.user._id.toString() !== invite.participantID.toString() && req.user.role !== 'admin') {
      return response.error(res, 'Not authorized', 403);
    }
    invite.status = action === 'accepted' ? 'accepted' : 'declined';
    await invite.save();
    response.success(res, invite);
  } catch (err) {
    console.error(err);
    response.error(res, 'Failed to respond to invite');
  }
};
