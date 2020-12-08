const protectedRoute = ctx => {
    const user = ctx.state.user;

    if (user.role_id != 2) {
        ctx.body = { notRights: true }
        return false;
    }
}

module.exports = protectedRoute