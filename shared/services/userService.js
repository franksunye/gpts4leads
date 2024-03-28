const crypto = require("crypto");
const logger = require("../utils/logger");
const userModel = require("../models/userModel");
const tenantModel = require("../models/tenantModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function generateRandomPassword(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

const createUserWithTenant = async (nickname, email) => {
  logger.info(`[userService.js] createUserWithTenant: Starting to create user with nickname: ${nickname} and email: ${email}`);
  try {
    logger.info(`[userService.js] createUserWithTenant: Attempting to create tenant with name: ${nickname}`);
    const tenantCreationResult = await tenantModel.create({
      Name: nickname,
    });
    logger.info(`[userService.js] createUserWithTenant: Tenant creation result: ${JSON.stringify(tenantCreationResult)}`);

    // const tenantId = tenantCreationResult[0];
    const tenantId = tenantCreationResult.TenantID;
    const tenant = await tenantModel.findById(tenantId);
    logger.info(`[userService.js] createUserWithTenant: Successfully created tenant with ID: ${tenantId}`);

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    logger.info(`[userService.js] createUserWithTenant: Attempting to create user with email: ${nickname} and email: ${email}`);
    const userCreationResult = await userModel.create({
      Email: email,
      Username: nickname,
      Password: hashedPassword,
      TenantID: tenantId,
    });

    // const userId = userCreationResult[0];
    const userId = userCreationResult.UserID;
    const user = await userModel.findById(userId);
    logger.info(`[userService.js] createUserWithTenant: Successfully created user with ID: ${userId} and tenant with ID: ${tenantId}`);

    return {
      user: user,
      tenant: tenant,
    };
  } catch (error) {
    logger.error(`[userService.js] createUserWithTenant: Error creating user with nickname: ${nickname} and email: ${email}. Error: ${error.message}`);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await userModel.findByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    logger.error(`[userService.js] getUserByUsername: Error finding user by username: ${username}. Error: ${error.message}`);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findByEmail(email);
    return user;
  } catch (error) {
    logger.error(`[userService.js] findUserByEmail: Error finding user by email: ${email}. Error: ${error.message}`);
    throw error;
  }
};

const softDeleteUser = async (userId) => {
  try {
    // Update the IsDeleted column to 1 for the specified user
    const result = await userModel.update(userId, {
      IsDeleted: 1,
    });

    if (result[0] === 0) {
      throw new Error("User not found");
    }

    return true;
  } catch (error) {
    logger.error(`[userService.js] softDeleteUser: Error soft deleting user: ${userId}. Error: ${error.message}`);
    throw error;
  }
};

const restoreUser = async (userId) => {
  try {
    // Update the IsDeleted column to 0 for the specified user
    const result = await userModel.update(userId, {
      IsDeleted: 0,
    });

    if (result[0] === 0) {
      throw new Error("User not found or already restored");
    }

    return true;
  } catch (error) {
    logger.error(`[userService.js] restoreUser: Error restoring user: ${userId}. Error: ${error.message}`);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    logger.info(`[userService.js] getUserById: called with userId: ${userId}`);
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    logger.error(`[userService.js] getUserById: Error getting user by ID: ${userId}. Error: ${error.message}`);
    throw error;
  }
};
// 在 userService.js 文件中

async function getTenantInfoByUserId(userId) {
  try {
     logger.info(`[userService.js] getTenantInfoByUserId: Fetching tenant info for userId: ${userId}`);
 
     // 使用 userModel 的 findById 方法获取用户信息
     const user = await userModel.findById(userId);
     if (!user) {
       logger.error(`[userService.js] getTenantInfoByUserId: User not found for userId: ${userId}`);
       throw new Error("User not found");
     }
 
     // 假设用户信息中有一个 TenantID 字段，用于关联租户信息
     const tenantId = user.TenantID;
     logger.debug(`[userService.js] getTenantInfoByUserId: Found tenant ID: ${tenantId} for userId: ${userId}`);
 
     // 使用 tenantModel 的 findById 方法获取租户信息
     const tenant = await tenantModel.findById(tenantId);
     if (!tenant) {
       logger.error(`[userService.js] getTenantInfoByUserId: Tenant not found for tenantId: ${tenantId}`);
       throw new Error("Tenant not found");
     }
 
     logger.info(`[userService.js] getTenantInfoByUserId: Successfully fetched tenant info for userId: ${userId}`);
 
     // 返回租户对象
     return tenant;
  } catch (error) {
     logger.error(`[userService.js] getTenantInfoByUserId: Error fetching tenant info for userId: ${userId}. Error: ${error.message}`);
     throw error;
  }
 }
 
 // 确保将 getTenantInfoByUserId 函数导出，以便在其他文件中使用
 module.exports = {
  findUserByEmail,
  createUserWithTenant,
  getTenantInfoByUserId, // 添加这行
  // 其他函数...
 };

module.exports = {
  getUserByUsername,
  createUserWithTenant,
  findUserByEmail,
  softDeleteUser,
  restoreUser,
  getUserById,
  getTenantInfoByUserId
};
