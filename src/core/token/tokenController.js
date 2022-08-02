const moment = require('moment');
const jwt = require('jsonwebtoken')
const Token = require('./tokenModel')

const generateToken = async (user_id, type) => {
    const payload = {
        _id: user_id,
        type,
    };
    const expires_in = process.env.ACCESS_TOKEN_EXPIRES_IN +' '+ process.env.ACCESS_TOKEN_EXPIRES_INTERVAL;
    const token = jwt.sign(payload, process.env.JWT_HASH, {expiresIn: expires_in});
    return token;
}

const createAccessToken = async (user) => {
    const accessTokenExpires = moment().add(process.env.TOKEN_EXPIRES_IN, process.env.TOKEN_EXPIRES_INTERVAL);
    const access_token = await generateToken(user._id, 'access');
    return await saveToken(access_token, user._id, 'access', accessTokenExpires);
}

const saveToken = async (token, user, type, expires, blacklisted = false) => {
    return await Token.create({
        token,
        user,
        type,
        expires: expires.toDate(),
        blacklisted
    });
}

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, process.env.JWT_HASH);
    const tokenDoc = await Token.findOne({ token, type, user: payload._id, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
};

module.exports = {
    createAccessToken,
    verifyToken
};