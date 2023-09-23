const axios = require('axios');

// Define the base URL for your server
const baseUrl = 'http://localhost:3000/api'; // Update with your actual server URL

// Admin JWT token, replace with your actual token
const adminToken = 'your-admin-jwt-token';

// Function to set JWT token in headers
function setJwtHeaders() {
  axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
}

// Function to test creating a new club
async function testCreateClub() {
  try {
    setJwtHeaders();
    const response = await axios.post(`${baseUrl}/clubs`, {
      name: 'Test Club',
    });
    console.log('Create Club Response:', response.data);
    const clubId = response.data._id; // Store the created club ID for future tests
    return clubId;
  } catch (error) {
    console.error('Error creating club:', error.response.data);
    return null;
  }
}

// Function to test getting all clubs
async function testGetAllClubs() {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/clubs`);
    console.log('Get All Clubs Response:', response.data);
  } catch (error) {
    console.error('Error getting all clubs:', error.response.data);
  }
}

// Function to test getting a club by ID
async function testGetClubById(clubId) {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/clubs/${clubId}`);
    console.log('Get Club by ID Response:', response.data);
  } catch (error) {
    console.error('Error getting club by ID:', error.response.data);
  }
}

// Function to test updating a club
async function testUpdateClub(clubId) {
  try {
    setJwtHeaders();
    const response = await axios.put(`${baseUrl}/clubs/${clubId}`, {
      name: 'Updated Club Name',
    });
    console.log('Update Club Response:', response.data);
  } catch (error) {
    console.error('Error updating club:', error.response.data);
  }
}

// Function to test deleting a club
async function testDeleteClub(clubId) {
  try {
    setJwtHeaders();
    const response = await axios.delete(`${baseUrl}/clubs/${clubId}`);
    console.log('Delete Club Response:', response.data);
  } catch (error) {
    console.error('Error deleting club:', error.response.data);
  }
}

// Function to test joining a club
async function testJoinClub(clubId) {
  try {
    setJwtHeaders();
    const response = await axios.post(`${baseUrl}/clubs/${clubId}/join`);
    console.log('Join Club Response:', response.data);
  } catch (error) {
    console.error('Error joining club:', error.response.data);
  }
}

// Function to test getting profiles by user
async function testGetProfilesByUser() {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/profiles`);
    console.log('Get Profiles by User Response:', response.data);
  } catch (error) {
    console.error('Error getting profiles by user:', error.response.data);
  }
}

// Function to test redeeming a code
async function testRedeemCode(code) {
  try {
    setJwtHeaders();
    const response = await axios.post(`${baseUrl}/redeem-code`, {
      code: code,
    });
    console.log('Redeem Code Response:', response.data);
  } catch (error) {
    console.error('Error redeeming code:', error.response.data);
  }
}

// Function to test deleting a profile
async function testDeleteProfile(profileId) {
  try {
    setJwtHeaders();
    const response = await axios.delete(`${baseUrl}/profiles/${profileId}`);
    console.log('Delete Profile Response:', response.data);
  } catch (error) {
    console.error('Error deleting profile:', error.response.data);
  }
}

// Function to test creating a code
async function testCreateCode() {
  try {
    setJwtHeaders();
    const response = await axios.post(`${baseUrl}/codes`, {
      code: 'TESTCODE123',
      expires: new Date(),
      status: 'active',
    });
    console.log('Create Code Response:', response.data);
  } catch (error) {
    console.error('Error creating code:', error.response.data);
  }
}

// Function to test getting all codes
async function testGetAllCodes() {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/codes`);
    console.log('Get All Codes Response:', response.data);
  } catch (error) {
    console.error('Error getting all codes:', error.response.data);
  }
}

// Function to test updating a code
async function testUpdateCode(codeId) {
  try {
    setJwtHeaders();
    const response = await axios.put(`${baseUrl}/codes/${codeId}`, {
      status: 'inactive',
    });
    console.log('Update Code Response:', response.data);
  } catch (error) {
    console.error('Error updating code:', error.response.data);
  }
}

// Function to test deleting a code
async function testDeleteCode(codeId) {
  try {
    setJwtHeaders();
    const response = await axios.delete(`${baseUrl}/codes/${codeId}`);
    console.log('Delete Code Response:', response.data);
  } catch (error) {
    console.error('Error deleting code:', error.response.data);
  }
}

// Function to test getting all fans
async function testGetAllFans() {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/fans`);
    console.log('Get All Fans Response:', response.data);
  } catch (error) {
    console.error('Error getting all fans:', error.response.data);
  }
}

// Function to test getting a fan by ID
async function testGetFanById(fanId) {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/fans/${fanId}`);
    console.log('Get Fan by ID Response:', response.data);
  } catch (error) {
    console.error('Error getting fan by ID:', error.response.data);
  }
}

// Function to test getting the current user's fan profile
async function testGetMyself() {
  try {
    setJwtHeaders();
    const response = await axios.get(`${baseUrl}/myself`);
    console.log('Get Myself Response:', response.data);
  } catch (error) {
    console.error('Error getting myself:', error.response.data);
  }
}

// Call the main testing function to start the flow
async function main() {
  try {
    const clubId = await testCreateClub();
    await testGetAllClubs();
    if (clubId) {
      await testGetClubById(clubId);
      await testUpdateClub(clubId);
      await testDeleteClub(clubId);
      await testJoinClub(clubId);
    }
    await testGetProfilesByUser();
    const code = 'TESTCODE123'; // Replace with a valid code
    await testRedeemCode(code);

    await testDeleteProfile('profileId123'); // Replace with a valid profile ID
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

main();
