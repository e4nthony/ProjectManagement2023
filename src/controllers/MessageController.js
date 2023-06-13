const Message = require('../models/Message');

async function get_message (req, res) {
    console.log('try to get messages');
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    get_message
}

