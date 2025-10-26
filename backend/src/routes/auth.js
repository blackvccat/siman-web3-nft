/**
 * 用户认证路由
 * 功能: 处理用户注册、登录、邮箱验证等认证相关的API请求
 */

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const { userDB } = require('../database/memoryDB')
const { asyncHandler, AppError } = require('../utils')

const router = express.Router()

// 邮箱验证码存储（实际项目中应使用Redis）
const emailVerificationCodes = new Map()
const passwordResetCodes = new Map()

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// 生成验证码
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送验证邮件
const sendVerificationEmail = async (email, code, type = 'verification') => {
  try {
    const transporter = createTransporter()
    
    let subject, html
    if (type === 'verification') {
      subject = 'Siman NFT - 邮箱验证'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Siman NFT 邮箱验证</h2>
          <p>您好！</p>
          <p>感谢您注册 Siman NFT 平台。请使用以下验证码完成邮箱验证：</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; font-size: 32px; margin: 0;">${code}</h1>
          </div>
          <p>验证码有效期为 10 分钟。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">Siman NFT 团队</p>
        </div>
      `
    } else if (type === 'password-reset') {
      subject = 'Siman NFT - 密码重置'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Siman NFT 密码重置</h2>
          <p>您好！</p>
          <p>您请求重置密码。请使用以下验证码完成密码重置：</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; font-size: 32px; margin: 0;">${code}</h1>
          </div>
          <p>验证码有效期为 10 分钟。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">Siman NFT 团队</p>
        </div>
      `
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html
    })
    
    return true
  } catch (error) {
    console.error('发送邮件失败:', error)
    throw new AppError('邮件发送失败', 500)
  }
}

/**
 * 发送邮箱验证码
 */
router.post('/send-verification-code', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('邮箱格式不正确', 400)
  }
  
  const { email } = req.body
  
  // 检查邮箱是否已注册
  const existingUser = userDB.findByEmail(email)
  if (existingUser) {
    throw new AppError('该邮箱已注册', 400)
  }
  
  // 生成验证码
  const code = generateVerificationCode()
  emailVerificationCodes.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟过期
  })
  
  // 发送验证邮件
  await sendVerificationEmail(email, code, 'verification')
  
  res.status(200).json({
    success: true,
    message: '验证码已发送到您的邮箱'
  })
}))

/**
 * 用户注册
 */
router.post('/register', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
  body('verificationCode').isLength({ min: 6, max: 6 }).withMessage('验证码格式不正确'),
  body('walletAddress').optional().isLength({ min: 42, max: 42 }).withMessage('钱包地址格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { email, password, verificationCode, walletAddress, name } = req.body
  
  // 验证验证码
  const storedCode = emailVerificationCodes.get(email)
  if (!storedCode || Date.now() > storedCode.expiresAt) {
    throw new AppError('验证码无效或已过期', 400)
  }
  
  if (storedCode.code !== verificationCode) {
    throw new AppError('验证码不正确', 400)
  }
  
  // 检查邮箱是否已注册
  const existingUser = userDB.findByEmail(email)
  if (existingUser) {
    throw new AppError('该邮箱已注册', 400)
  }
  
  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // 创建用户
  const user = userDB.create({
    email,
    password: hashedPassword,
    walletAddress: walletAddress || null,
    name: name || email.split('@')[0],
    isEmailVerified: true,
    role: 'user',
    loginMethod: 'email'
  })
  
  // 清除验证码
  emailVerificationCodes.delete(email)
  
  // 生成JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
  
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    },
    message: '注册成功'
  })
}))

/**
 * 用户登录
 */
router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').notEmpty().withMessage('请输入密码')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { email, password } = req.body
  
  // 查找用户
  const user = userDB.findByEmail(email)
  if (!user) {
    throw new AppError('邮箱或密码不正确', 401)
  }
  
  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new AppError('邮箱或密码不正确', 401)
  }
  
  // 生成JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    },
    message: '登录成功'
  })
}))

/**
 * Google OAuth 登录
 */
router.post('/google-login', [
  body('googleToken').notEmpty().withMessage('Google token不能为空')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('Google token格式不正确', 400)
  }
  
  const { googleToken, name, email, picture } = req.body
  
  // 验证Google token（这里简化处理，实际项目中需要验证Google token）
  if (!email) {
    throw new AppError('Google登录信息不完整', 400)
  }
  
  // 查找或创建用户
  let user = userDB.findByEmail(email)
  
  if (!user) {
    // 创建新用户
    user = userDB.create({
      email,
      name: name || email.split('@')[0],
      password: null, // Google登录用户不需要密码
      walletAddress: null,
      isEmailVerified: true,
      role: 'user',
      loginMethod: 'google',
      avatar: picture
    })
  } else {
    // 更新现有用户信息
    user = userDB.update(user.id, {
      name: name || user.name,
      avatar: picture || user.avatar,
      lastLoginAt: new Date().toISOString()
    })
  }
  
  // 生成JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      },
      token
    },
    message: 'Google登录成功'
  })
}))

/**
 * 忘记密码 - 发送重置验证码
 */
router.post('/forgot-password', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('邮箱格式不正确', 400)
  }
  
  const { email } = req.body
  
  // 检查用户是否存在
  const user = userDB.findByEmail(email)
  if (!user) {
    throw new AppError('该邮箱未注册', 404)
  }
  
  // 生成重置验证码
  const code = generateVerificationCode()
  passwordResetCodes.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟过期
  })
  
  // 发送重置邮件
  await sendVerificationEmail(email, code, 'password-reset')
  
  res.status(200).json({
    success: true,
    message: '密码重置验证码已发送到您的邮箱'
  })
}))

/**
 * 重置密码
 */
router.post('/reset-password', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('verificationCode').isLength({ min: 6, max: 6 }).withMessage('验证码格式不正确'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const { email, verificationCode, newPassword } = req.body
  
  // 验证重置验证码
  const storedCode = passwordResetCodes.get(email)
  if (!storedCode || Date.now() > storedCode.expiresAt) {
    throw new AppError('验证码无效或已过期', 400)
  }
  
  if (storedCode.code !== verificationCode) {
    throw new AppError('验证码不正确', 400)
  }
  
  // 查找用户
  const user = userDB.findByEmail(email)
  if (!user) {
    throw new AppError('用户不存在', 404)
  }
  
  // 加密新密码
  const hashedPassword = await bcrypt.hash(newPassword, 12)
  
  // 更新密码
  userDB.update(user.id, {
    password: hashedPassword,
    updatedAt: new Date().toISOString()
  })
  
  // 清除重置验证码
  passwordResetCodes.delete(email)
  
  res.status(200).json({
    success: true,
    message: '密码重置成功'
  })
}))

/**
 * 获取用户信息
 */
router.get('/profile', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    throw new AppError('请先登录', 401)
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    const user = userDB.findById(decoded.id)
    
    if (!user) {
      throw new AppError('用户不存在', 404)
    }
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          walletAddress: user.walletAddress,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    throw new AppError('Token无效', 401)
  }
}))

/**
 * 更新用户信息
 */
router.put('/profile', [
  body('name').optional().isLength({ min: 1 }).withMessage('姓名不能为空'),
  body('walletAddress').optional().isLength({ min: 42, max: 42 }).withMessage('钱包地址格式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    throw new AppError('请先登录', 401)
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    const user = userDB.findById(decoded.id)
    
    if (!user) {
      throw new AppError('用户不存在', 404)
    }
    
    const { name, walletAddress } = req.body
    const updateData = {}
    
    if (name) updateData.name = name
    if (walletAddress) updateData.walletAddress = walletAddress
    
    const updatedUser = userDB.update(user.id, updateData)
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          walletAddress: updatedUser.walletAddress,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified,
          avatar: updatedUser.avatar
        }
      },
      message: '用户信息更新成功'
    })
  } catch (error) {
    throw new AppError('Token无效', 401)
  }
}))

/**
 * 修改密码
 */
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('请输入当前密码'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new AppError('输入信息格式不正确', 400)
  }
  
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    throw new AppError('请先登录', 401)
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    const user = userDB.findById(decoded.id)
    
    if (!user) {
      throw new AppError('用户不存在', 404)
    }
    
    const { currentPassword, newPassword } = req.body
    
    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw new AppError('当前密码不正确', 400)
    }
    
    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    // 更新密码
    userDB.update(user.id, {
      password: hashedNewPassword,
      updatedAt: new Date().toISOString()
    })
    
    res.status(200).json({
      success: true,
      message: '密码修改成功'
    })
  } catch (error) {
    throw new AppError('Token无效', 401)
  }
}))

module.exports = router