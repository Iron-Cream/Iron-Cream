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

const getPhotoUrl = (id, width = 400) => {
  let url = `https://maps.googleapis.com/maps/api/place/photo?`;
  url += `maxwidth=${width}&photoreference=${id}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  return url;
};

module.exports = { getDetails, getPhotoUrl };
