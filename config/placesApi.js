require('dotenv').config();
const Places = require('google-places-web').default;
Places.apiKey = process.env.GOOGLE_PLACES_API_KEY;

const getDetails = async (placeid) => {
  try {
    const response = await Places.details({ placeid });
    const { result } = response;
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = getDetails;
