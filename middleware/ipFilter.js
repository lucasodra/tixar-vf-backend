const blockedIPs = ['::ffff:10.1.95.105']; 

exports.blockIPs = (req, res, next) => {
    const clientIP = req.ip; // or req.connection.remoteAddress for older Express versions
    console.log(clientIP);
    if (blockedIPs.includes(clientIP)) {
        res.status(403).send('Your IP address is blocked.');
        return;
    }
    next();
}
