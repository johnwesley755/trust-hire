import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const data = req.body;

    const ticket = await prisma.support_tickets.create({
      data: {
        id: uuidv4(),
        user_id: userId || null,
        subject: data.subject,
        message: data.message,
        status: data.status || 'OPEN',
        priority: data.priority || 'NORMAL',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    res.json(ApiResponse.ok("Ticket created successfully", ticket));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
