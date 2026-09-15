import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const createTicket = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    const data = (await c.req.json());

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

    return c.json(ApiResponse.ok("Ticket created successfully", ticket));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
