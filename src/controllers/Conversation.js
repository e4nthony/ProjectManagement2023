const Conversation = require('../models/Conversation');

async function get_convo (req, res) {
    console.log('start getting convo');
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.query._id] }
        });
        if (conversation === null) {
            console.log('this is null convo');
        }
        res.status(200).json(conversation);
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    get_convo
}
