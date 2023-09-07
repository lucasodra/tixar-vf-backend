const axios = require('axios');

// Define the base URL for your server
const baseUrl = 'http://localhost:3000/api'; // Update with your actual server URL

var clubId = null;

// Function to test creating a new club
async function testCreateClub() {
  try {
    const response = await axios.post(`${baseUrl}/clubs`, {
      name: 'Test Club',
    });
    console.log('Create Club Response:', response.data);
    clubId = response.data._id;
  } catch (error) {
    console.error('Error creating club:', error.response.data);
  }
}

// Function to test updating club name
async function testUpdateClubName(clubId) {
  try {
    const response = await axios.put(`${baseUrl}/clubs/${clubId}`, {
      name: 'Updated Club Name',
    });
    console.log('Update Club Name Response:', response.data);
  } catch (error) {
    console.error('Error updating club name:', error.response.data);
  }
}

// Function to test creating a new code
async function testCreateCode() {
  try {
    const response = await axios.post(`${baseUrl}/codes`, {
      code: 'TEST123',
      description: 'Test Code',
      club: 'clubId', // Replace with the actual club ID
      expires: '2023-12-31',
      value: 100,
      status: 'Active',
    });
    console.log('Create Code Response:', response.data);
  } catch (error) {
    console.error('Error creating code:', error.response.data);
  }
}

// Function to test updating code description
async function testUpdateCodeDescription(codeId) {
  try {
    const response = await axios.put(`${baseUrl}/codes/${codeId}/description`, {
      description: 'Updated Code Description',
    });
    console.log('Update Code Description Response:', response.data);
  } catch (error) {
    console.error('Error updating code description:', error.response.data);
  }
}

// Function to test updating code expiry
async function testUpdateCodeExpiry(codeId) {
  try {
    const response = await axios.put(`${baseUrl}/codes/${codeId}/expiry`, {
      expires: '2024-12-31',
    });
    console.log('Update Code Expiry Response:', response.data);
  } catch (error) {
    console.error('Error updating code expiry:', error.response.data);
  }
}

// Function to test updating code status
async function testUpdateCodeStatus(codeId) {
  try {
    const response = await axios.put(`${baseUrl}/codes/${codeId}/status`, {
      status: 'Inactive',
    });
    console.log('Update Code Status Response:', response.data);
  } catch (error) {
    console.error('Error updating code status:', error.response.data);
  }
}

// Function to test creating a new fan
async function testCreateFan() {
  try {
    const response = await axios.post(`${baseUrl}/fans`, {
      fanMobile: {
        countryCode: '+1',
        number: '1234567890',
      },
      fanEmail: 'test@example.com',
    });
    console.log('Create Fan Response:', response.data);
  } catch (error) {
    console.error('Error creating fan:', error.response.data);
  }
}

// Function to test updating fan mobile
async function testUpdateFanMobile(fanId) {
  try {
    const response = await axios.put(`${baseUrl}/fans/${fanId}/mobile`, {
      countryCode: '+1',
      number: '9876543210',
    });
    console.log('Update Fan Mobile Response:', response.data);
  } catch (error) {
    console.error('Error updating fan mobile:', error.response.data);
  }
}

// Function to test updating fan email
async function testUpdateFanEmail(fanId) {
  try {
    const response = await axios.put(`${baseUrl}/fans/${fanId}/email`, {
      fanEmail: 'updated@example.com',
    });
    console.log('Update Fan Email Response:', response.data);
  } catch (error) {
    console.error('Error updating fan email:', error.response.data);
  }
}

// Function to test setting fan rtId
async function testSetFanRtId(fanId) {
  try {
    const response = await axios.put(`${baseUrl}/fans/${fanId}/rtid`, {
      rtId: 'RT12345',
    });
    console.log('Set Fan RTID Response:', response.data);
  } catch (error) {
    console.error('Error setting fan RTID:', error.response.data);
  }
}

// Function to test creating a new profile
async function testCreateProfile() {
  try {
    const response = await axios.post(`${baseUrl}/profiles`, {
      fanId: 'fanId', // Replace with the actual fan ID
      club: 'clubId', // Replace with the actual club ID
    });
    console.log('Create Profile Response:', response.data);
  } catch (error) {
    console.error('Error creating profile:', error.response.data);
  }
}

// Function to test activating a code with an identifier
async function testActivateCode(identifier, code) {
  try {
    const response = await axios.post(`${baseUrl}/activate-code`, {
      identifier,
      code,
    });
    console.log('Activate Code Response:', response.data);
  } catch (error) {
    console.error('Error activating code:', error.response.data);
  }
}

// Example usage of the test functions
testCreateClub();
testUpdateClubName();
testCreateCode();
testUpdateCodeDescription();
testUpdateCodeExpiry();
testUpdateCodeStatus();
testCreateFan();
testUpdateFanMobile();
testUpdateFanEmail();
testSetFanRtId();
testCreateProfile();
testActivateCode();

