const crypto = require("crypto");
const logger = require("../utils/logger");
const userModel = require("../models/userModel");
const tenantModel = require("../models/tenantModel");
const tenantPlanModel = require("../models/tenantPlanModel");
const usageTrackingModel = require("../models/usageTrackingModel");

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
      name: nickname,
    });
    logger.info(`[userService.js] createUserWithTenant: Tenant creation result: ${JSON.stringify(tenantCreationResult)}`);

    // const tenantId = tenantCreationResult[0];
    const tenantId = tenantCreationResult.tenant_id;
    const tenant = await tenantModel.findById(tenantId);
    logger.info(`[userService.js] createUserWithTenant: Successfully created tenant with ID: ${tenantId}`);

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    logger.info(`[userService.js] createUserWithTenant: Attempting to create user with email: ${nickname} and email: ${email}`);
    const userCreationResult = await userModel.create({
      email: email,
      username: nickname,
      password: hashedPassword,
      tenant_id: tenantId,
    });

    // const userId = userCreationResult[0];
    const userId = userCreationResult.user_id;
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

const createUserWithTenantAndPlan = async (nickname, email, plan_id) => {
  logger.info(`[userService.js] createUserWithTenantAndPlan: Starting to create user with nickname: ${nickname}, email: ${email}, and plan_id: ${plan_id}`);
  try {
    logger.info(`[userService.js] createUserWithTenantAndPlan: Attempting to create tenant with name: ${nickname}`);
    const tenantCreationResult = await tenantModel.create({
      name: nickname,
    });
    logger.info(`[userService.js] createUserWithTenantAndPlan: Tenant creation result: ${JSON.stringify(tenantCreationResult)}`);

    const tenantId = tenantCreationResult.tenant_id;
    const tenant = await tenantModel.findById(tenantId);
    logger.info(`[userService.js] createUserWithTenantAndPlan: Successfully created tenant with ID: ${tenantId}`);

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    logger.info(`[userService.js] createUserWithTenantAndPlan: Attempting to create user with email: ${nickname} and email: ${email}`);
    const userCreationResult = await userModel.create({
      email: email,
      username: nickname,
      password: hashedPassword,
      tenant_id: tenantId,
    });

    const userId = userCreationResult.user_id;
    const user = await userModel.findById(userId);
    logger.info(`[userService.js] createUserWithTenantAndPlan: Successfully created user with ID: ${userId} and tenant with ID: ${tenantId}`);

    // Attempting to create tenant plan
    logger.info(`[userService.js] createUserWithTenantAndPlan: Attempting to create tenant plan with plan_id: ${plan_id}`);
    const currentDate = new Date();
    const startDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 12)).toISOString().slice(0, 19).replace('T', ' ');
    const planCreationResult = await tenantPlanModel.create({
      plan_id: plan_id,
      tenant_id: tenantId,
      start_date: startDate,
      end_date: endDate,
    });
    logger.info(`[userService.js] createUserWithTenantAndPlan: Tenant plan creation result: ${JSON.stringify(planCreationResult)}`);

    // Assuming the planCreationResult contains the planId of the newly created plan
    const planId = planCreationResult.plan_id;
    logger.info(`[userService.js] createUserWithTenantAndPlan: Successfully created tenant plan with ID: ${planId} for tenant with ID: ${tenantId}`);

    const usageData = {
      tenant_id: tenantId,
      user_count: 1,
      form_count: 0,
      entry_count:0,
    };
    await usageTrackingModel.create(usageData);

    return {
      user: user,
      tenant: tenant,
      plan: planId, // Returning the planId as part of the response
    };
  } catch (error) {
    logger.error(`[userService.js] createUserWithTenantAndPlan: Error creating user with nickname: ${nickname}, email: ${email}, and plan_id: ${plan_id}. Error: ${error.message}`);
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

async function getTenantInfoByUserId(userId) {
  try {
     logger.info(`[userService.js] getTenantInfoByUserId: Fetching tenant info for userId: ${userId}`);
 
     // 使用 userModel 的 findById 方法获取用户信息
     const user = await userModel.findById(userId);
     if (!user) {
       logger.error(`[userService.js] getTenantInfoByUserId: User not found for userId: ${userId}`);
       throw new Error("User not found");
     }
 
     // 假设用户信息中有一个 tenant_id 字段，用于关联租户信息
     const tenantId = user.tenant_id;
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
 
module.exports = {
  getUserByUsername,
  createUserWithTenant,
  findUserByEmail,
  softDeleteUser,
  restoreUser,
  getUserById,
  getTenantInfoByUserId,
  createUserWithTenantAndPlan,
};
