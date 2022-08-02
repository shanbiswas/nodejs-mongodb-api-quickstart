module.exports = {
    isAdmin: (roles) => {
        if( Array.isArray(roles) && roles.includes('admin') )
            return true
        return false
    },
}