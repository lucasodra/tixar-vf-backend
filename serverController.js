const Club = require('./clubModel');
const Code = require('./codeModel');
const Fan = require('./fanModel');
const Profile = require('./profileModel');

// Function to create a new club
const createClub = async (req, res) => {
  try {
    const { name } = req.body;
    const club = new Club({ name });
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update club name
const updateClubName = async (req, res) => {
  const { clubId } = req.params;
  const { name } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    club.name = name;

    await club.save();
    res.json(club);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to create a new code and add it to the club
const createCode = async (req, res) => {
  const { code, description, club, expires, value, status } = req.body;

  try {
    // Check if the code already exists
    const existingCode = await Code.findOne({ code });
    if (existingCode) {
      // Check if the existing code has expired
      if (existingCode.expires > new Date()) {
        return res.status(400).json({ error: 'Code already exists and has not expired yet' });
      }
      // If the code exists and has expired, delete it
      await existingCode.remove();
    }

    // Create a new code
    const newCode = new Code({
      code,
      description,
      club,
      expires,
      value,
      status,
    });

    await newCode.save();

    // Add the new code's ID to the club's "codes" field
    const clubToUpdate = await Club.findById(club);
    if (clubToUpdate) {
      clubToUpdate.codes.push(newCode._id);
      await clubToUpdate.save();
    }

    res.status(201).json(newCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update code description
const updateCodeDescription = async (req, res) => {
  const { codeId } = req.params;
  const { description } = req.body;

  try {
    const code = await Code.findById(codeId);
    if (!code) {
      return res.status(404).json({ error: 'Code not found' });
    }

    code.description = description;

    await code.save();
    res.json(code);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update code expiry
const updateCodeExpiry = async (req, res) => {
  const { codeId } = req.params;
  const { expires } = req.body;

  try {
    const code = await Code.findById(codeId);
    if (!code) {
      return res.status(404).json({ error: 'Code not found' });
    }

    code.expires = expires;

    await code.save();
    res.json(code);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update code status
const updateCodeStatus = async (req, res) => {
  const { codeId } = req.params;
  const { status } = req.body;

  try {
    const code = await Code.findById(codeId);
    if (!code) {
      return res.status(404).json({ error: 'Code not found' });
    }

    code.status = status;

    await code.save();
    res.json(code);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to create a new fan
const createFan = async (req, res) => {
  try {
    const { fanMobile, fanEmail } = req.body;
    const fan = new Fan({ fanMobile, fanEmail });
    await fan.save();
    res.status(201).json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update fan mobile
const updateFanMobile = async (req, res) => {
  const { fanId } = req.params;
  const { countryCode, number } = req.body;

  try {
    const fan = await Fan.findById(fanId);
    if (!fan) {
      return res.status(404).json({ error: 'Fan not found' });
    }

    fan.fanMobile.countryCode = countryCode;
    fan.fanMobile.number = number;

    await fan.save();
    res.json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to update fan email
const updateFanEmail = async (req, res) => {
  const { fanId } = req.params;
  const { fanEmail } = req.body;

  try {
    const fan = await Fan.findById(fanId);
    if (!fan) {
      return res.status(404).json({ error: 'Fan not found' });
    }

    fan.fanEmail = fanEmail;

    await fan.save();
    res.json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to set fan rtId (can only be done once)
const setFanRtId = async (req, res) => {
  const { fanId } = req.params;
  const { rtId } = req.body;

  try {
    const fan = await Fan.findById(fanId);
    if (!fan) {
      return res.status(404).json({ error: 'Fan not found' });
    }

    if (fan.rtId) {
      return res.status(400).json({ error: 'RTID already set for this fan' });
    }

    fan.rtId = rtId;

    await fan.save();
    res.json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to create a new profile and update fan's "profiles" field and club's "members" field
const createProfile = async (req, res) => {
  try {
    const { fanId, club } = req.body;
    const profile = new Profile({ fanId, club });
    await profile.save();

    // Update fan's "profiles" field
    const fanToUpdate = await Fan.findById(fanId);
    if (fanToUpdate) {
      fanToUpdate.profiles.push(profile._id);
      await fanToUpdate.save();
    }

        // Update club's "members" field
        const clubToUpdate = await Club.findById(club);
        if (clubToUpdate) {
          clubToUpdate.members.push(profile._id);
          await clubToUpdate.save();
        }
    
        res.status(201).json(profile);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
    
    // Function to activate a code and add points and create a history record in the profile
    const activateCode = async (req, res) => {
      const { fanId, code } = req.body;
    
      try {
        // Check if the code exists and is valid
        const existingCode = await Code.findOne({ code });
        if (!existingCode) {
          return res.status(404).json({ error: 'Code not found' });
        }
    
        if (existingCode.expires < new Date()) {
          return res.status(400).json({ error: 'Code has expired' });
        }
    
        // Find the profile of the fan
        const profile = await Profile.findOne({ fanId });
    
        if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
        }
    
        // Add points to the profile
        profile.points += existingCode.value;
    
        // Create a history record in the profile
        const newTransaction = {
          txType: 'Activation',
          txDescription: `Activated code ${code}`,
          txCode: code,
          txValue: existingCode.value,
          txDate: new Date(),
        };
    
        profile.history.push(newTransaction);
    
        // Save changes to the profile
        await profile.save();
    
        res.json(profile);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
    
    module.exports = {
      createClub,
      updateClubName,
      createCode,
      updateCodeDescription,
      updateCodeExpiry,
      updateCodeStatus,
      createFan,
      updateFanMobile,
      updateFanEmail,
      setFanRtId,
      createProfile,
      activateCode,
    };
    
