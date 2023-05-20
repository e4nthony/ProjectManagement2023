const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken');

    if (!accessToken) {
        return res.json({ error: 'User are not logged in!' });
    }

    try {
        const validToken = verify(accessToken, 'AniMaccabiMiAtemBihlal');

        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
    return res.json({ error: 'Unkown error' });
};

module.exports = { validateToken };

/**
 * this is authentication for the user's accessToken,
 * if the token is valid - the "next()" function will be called and grant access to the user
 * if the token is invalid - that means the user's request exceeding from his permissions
 * 
 * syntax example: 
 * 
    router.post('/register', validateToken, async (req, res) => {
        // code of router.post('/register')
    res.send({ msg: 'default response from server \"auth\\register\" path' });
});
 */




