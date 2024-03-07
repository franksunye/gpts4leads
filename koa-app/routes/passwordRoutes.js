const Router = require('koa-router');
const bcrypt = require('bcrypt');
const knex = require('../../shared/database'); //  确保这是你的数据库连接

const router = new Router();

async function updateUserPassword(userId, newPassword) {
  try {
    const saltRounds =  10; //  你可以根据需要调整这个值
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await knex('Users').where('UserID', userId).update({ Password: hashedPassword });
    return { message: 'Password updated successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.put('/password/:userId', async (ctx) => {
  const { userId } = ctx.params;
  const { newPassword } = ctx.request.body;

  if (!userId || !newPassword) {
    ctx.status =  400;
    ctx.body = { error: 'User ID and new password are required' };
    return;
  }

  try {
    const result = await updateUserPassword(userId, newPassword);
    ctx.status =  200;
    ctx.body = result;
  } catch (error) {
    ctx.status =  500;
    ctx.body = { error: 'Failed to update password' };
  }
});

module.exports = router;