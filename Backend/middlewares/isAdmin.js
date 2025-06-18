
function isAdmin(req, res, next){
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message: 'Admin ascess only'})
    }
    next();
}

module.exports = isAdmin;