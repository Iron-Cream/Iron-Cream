require('dotenv').config();
const Places = require('google-places-web').default;
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
Places.apiKey = apiKey;

const getDetails = async (placeid) => {
  try {
    const response = await Places.details({ placeid });
    const { result } = response;
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getPhotoUrl = (id, width = 400) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photoreference=${id}&key=${apiKey}`;

module.exports = { getDetails, getPhotoUrl };
