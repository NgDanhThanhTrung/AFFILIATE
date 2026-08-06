import { Request, Response, NextFunction } from 'express'
import orderService from '../services/order.service'
import { OrderStatus, Platform } from '@prisma/client'

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { platformOrderId, platform, orderAmount, subId, metadata } = req.body

    const order = await orderService.createOrder(
      userId,
      platformOrderId,
      platform,
      orderAmount,
      subId,
      metadata
    )

    res.json({
      success: true,
      data: order,
      message: 'Đã tạo đơn hàng thành công',
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { orderId } = req.params

    const order = await orderService.getOrderById(orderId, userId)

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as OrderStatus | undefined
    const platform = req.query.platform as Platform | undefined
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const result = await orderService.getUserOrders(
      userId,
      page,
      limit,
      status,
      platform,
      startDate,
      endDate
    )

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params
    const { status, metadata } = req.body

    const order = await orderService.updateOrderStatus(orderId, status, metadata)

    res.json({
      success: true,
      data: order,
      message: 'Đã cập nhật trạng thái đơn hàng',
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

    const stats = await orderService.getOrderStats(userId, startDate, endDate)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const reconcileOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await orderService.reconcileOrders()

    res.json({
      success: true,
      data: result,
      message: 'Đã hoàn tất đối soát đơn hàng',
    })
  } catch (error) {
    next(error)
  }
}