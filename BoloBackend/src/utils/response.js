module.exports = {
  success: (res, data = {}, status = 200) => res.status(status).json({ success: true, data }),
  error: (res, message = 'Something went wrong', status = 400) => res.status(status).json({ success: false, message })
};
