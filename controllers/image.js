require('dotenv').config();
// const Clarifai = require('clarifai');
// //using this console.log we can see the models and get the face detection id
// console.log(Clarifai);
const apiKey = process.env.API_KEY;
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + `${apiKey}`);

// const app = new Clarifai.App({
//     apiKey: 'a34a61556da74e1b9fbd934fa8f8a0af',
// });
//grpc API

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            res.json(response);
        }
    );
};

// RESTful API
// const handleApiCall = (req, res) => {
//     app.models
//         .predict(Clarifai.FACE_DETECT_MODEL, req.body.input,)
//         .then(data => {
//             res.json(data);
//         })
//         .catch(err => res.status(400).json('Unable to work with API'));

// };
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
};

module.exports = {
    handleImage,
    handleApiCall
};