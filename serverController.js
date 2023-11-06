const mongoose = require('mongoose');
const Club = require('./models/clubModel');
const Profile = require('./models/profileModel');
const Code = require('./models/codeModel');
const Fan = require('./models/fanModel');

// Club Controllers
exports.createClub = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type !== "admin") return res.status(403).json({ message: "restricted" });
        
        var imageUrl = null; 
        if (req.file) {
            imageUrl = req.file.location;
        }

        const club = new Club({
            name: req.body.name,
            description: req.body.description,
            imageUrl: imageUrl
        });

        await club.save();
        res.status(201).json(club);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find().populate([
            {
                path: 'members', 
                populate: {
                    path: 'fanId',
                    select: 'rtId name phone'
                }
            },
            {
                path: 'codes', 
                populate: {
                    path: '_id',
                    select: 'code value expiry'
                }
            }
        ]);
        res.json(clubs);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.getClubById = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id).populate({
            path: 'members', 
            populate: {
                path: 'fanId',
                select: 'rtId name phone'
            }
          });
        if (!club) return res.status(404).json({message: "Club not found"});
        res.json(club);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateClub = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: "Club not found" });

        if (req.body.name) {
            club.name = req.body.name;
        }

        if (req.body.description) {
            club.description = req.body.description;
        }
        
        if (req.file) {
            const imageUrl = req.file.location;
            club.imageUrl = imageUrl;
        }

        await club.save();
        res.json(club);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteClub = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});
        await Club.findByIdAndDelete(req.params.id);
        res.json({message: "Club deleted"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.joinClub = async (req, res) => {
    try {
        let profile = await Profile.findOne({"fanId": req.fan._id, "club": req.params.clubId});
        if (!profile) {
            profile = new Profile({
                fanId: req.fan._id,
                club: req.params.clubId
            });

            await profile.save();
        }
        
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
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.getVfPosition = async(req, res) => {
    try {
        const { profileId, threshold } = req.body;

        const profile = await Profile.findById(profileId);

        if (!profile) {
            return res.status(400).json({message: "Profile not found"});
        }
        
        const club = await Club.findById(profile.club._id);

        const totalProfile = await Profile.countDocuments({'club': club._id});
        const cutOffIndex = Math.ceil(totalProfile * (threshold/100)) - 1;

        const cutOffProfile = await Profile.find({'club': club._id}).sort({points: -1}).skip(cutOffIndex).limit(1);

        if (cutOffProfile.length == 0) {
            return res.status(200).json(true);
        }

        const isTop = profile.points >= cutOffProfile[0].points;

        return res.status(200).json(isTop);

    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Profile Controllers
exports.getProfilesByUser = async (req, res) => {
    try {
        const profiles = await Profile.find({ fanId: req.fan._id }).populate({
              path: 'club', 
              select: 'name description imageUrl'
            });
        res.json(profiles);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.redeemCode = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await Profile.findByIdAndDelete(req.params.id);
        res.json({message: "Profile deleted"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Code Controllers
exports.createCode = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        const existingCode = await Code.findOne({ code: req.body.code });
        
        if (existingCode) {
            return res.status(400).json({ message: "Code already exists." });
        }

        const club = await Club.findOne({_id: req.body.club});

        if (!club) {
            return res.status(400).json({ message: "Club dont exist"});
        }

        const code = new Code(req.body);
        await code.save();
        club.codes.push(code._id);
        club.save();
        res.status(201).json(code);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};


exports.getAllCodes = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        const codes = await Code.find().populate({
            'path': 'club',
            'select': 'name'
        });
        res.json(codes);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateCode = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        const code = await Code.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(code);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteCode = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        await Code.findByIdAndDelete(req.params.id);
        res.json({message: "Code deleted successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Fan Controllers
exports.getAllFans = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        const fans = await Fan.find().populate({
            path: 'profiles',
            populate: {
              path: 'club', 
              select: 'name'
            }
          });
        res.json(fans);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.getFanById = async (req, res) => {
    try {
        // ADMIN ONLY
        if (req.user.type != "admin") return res.status(403).json({message: "restricted"});

        const fan = await Fan.findById(req.params.id).populate({
            path: 'profiles',
            populate: {
              path: 'club', 
              select: 'name'
            }
          });;
        if (!fan) return res.status(404).json({message: "Fan not found"});
        res.json(fan);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.getMyself = async (req, res) => {
    try {
        const fan = await Fan.findById(req.fan._id).populate({
            path: 'profiles', 
            populate: { path: 'club', select: 'name' } // Here we further populate the 'club' field and select only the 'name' of the club.
        });
        
        if (!fan) return res.status(404).json({message: "Fan not found"});
        res.json(fan);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

