const Club = require('./models/clubModel');
const Profile = require('./models/profileModel');
const Code = require('./models/codeModel');
const Fan = require('./models/fanModel');

// Club Controllers
exports.createClub = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
};

exports.getAllClubs = async (req, res) => {
    const clubs = await Club.find();
    res.json(clubs);
};

exports.getClubById = async (req, res) => {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({message: "Club not found"});
    res.json(club);
};

exports.updateClub = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(club);
};

exports.deleteClub = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});
    await Club.findByIdAndDelete(req.params.id);
    res.json({message: "Club deleted"});
};

exports.joinClub = async (req, res) => {
    const profile = new Profile({
        fanId: req.fan._id,
        club: req.params.clubId
    });

    await profile.save();

    // Update the Fan model to include the profile ID.
    const fan = await Fan.findById(req.fan._id);
    if(!fan.profiles.includes(profile._id)) {
        fan.profiles.push(profile._id);
        await fan.save();
    }

    // Update the Club model to include the profile ID.
    const club = await Club.findById(req.params.clubId);
    if(!club.members.includes(profile._id)) {
        club.members.push(profile._id);
        await club.save();
    }

    res.status(201).json(profile);
};

// Profile Controllers
exports.getProfilesByUser = async (req, res) => {
    const profiles = await Profile.find({ fanId: req.fan._id });
    res.json(profiles);
};

exports.redeemCode = async (req, res) => {
  const { code: codeToRedeem } = req.body;

  // Step 1: Check if the code is valid from Code
  const validCode = await Code.findOne({
      code: codeToRedeem,
      expires: { $gt: new Date() }, // ensure the code hasn't expired
      status: 'active'  // assuming 'active' means the code is valid
  });

  if (!validCode) {
      return res.status(400).json({ message: "Invalid or expired code." });
  }

  // Step 2: Check if the code has been used before in the "redemption" field
  const profileWithRedemption = await Profile.findOne({
      fanId: req.fan._id,
      'redemption.txCode': codeToRedeem
  });

  if (profileWithRedemption) {
      return res.status(400).json({ message: "Code has already been redeemed." });
  }

  // Step 3: Add the points carried by the Code into the Profile of the requesting Fan
  const fanProfile = await Profile.findOne({ fanId: req.fan._id });

  if (!fanProfile) {
      return res.status(404).json({ message: "Profile not found for the fan." });
  }

  fanProfile.points += validCode.value;
  fanProfile.redemption.push({
      txType: "codeRedemption",
      txCode: codeToRedeem,
      txValue: validCode.value,
      txDate: new Date()
  });

  await fanProfile.save();

  return res.status(200).json({
      message: "Code successfully redeemed.",
      updatedPoints: fanProfile.points
  });
};

exports.deleteProfile = async (req, res) => {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({message: "Profile deleted"});
};

// Code Controllers
exports.createCode = async (req, res) => {
  // ADMIN ONLY
  if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

  const existingCode = await Code.findOne({ code: req.body.code });
  
  if (existingCode) {
      return res.status(400).json({ message: "Code already exists." });
  }

  const code = new Code(req.body);
  await code.save();
  res.status(201).json(code);
};


exports.getAllCodes = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

    const codes = await Code.find();
    res.json(codes);
};

exports.updateCode = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

    const code = await Code.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(code);
};

exports.deleteCode = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

    await Code.findByIdAndDelete(req.params.id);
    res.json({message: "Code deleted successfully"});
};

// Fan Controllers
exports.getAllFans = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

    const fans = await Fan.find();
    res.json(fans);
};

exports.getFanById = async (req, res) => {
    // ADMIN ONLY
    if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

    const fan = await Fan.findById(req.params.id);
    if (!fan) return res.status(404).json({message: "Fan not found"});
    res.json(fan);
};

exports.getMyself = async (req, res) => {
  const fan = await Fan.findById(req.fan._id);
  if (!fan) return res.status(404).json({message: "Fan not found"});
  res.json(fan);
};

