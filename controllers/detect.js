//CLARIFAI API VERY IMPORTANT
const returnClarifaiRequestOptions = function (img) {
  // Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = process.env.API_KEY;
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "8rbi0vcpvzmz";
  const APP_ID = "test";

  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  const IMAGE_URL = img;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const detectFace = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await fetch(
      `https://api.clarifai.com/v2/models/face-detection/outputs`,
      returnClarifaiRequestOptions(imageUrl)
    );

    const result = await response.json();

    if (!result.outputs) {
      return res
        .status(400)
        .json({ error: "Failed to fetch data from Clarifai" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = detectFace;
