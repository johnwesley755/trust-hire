import { Context } from 'hono';
import { ApiResponse } from '../utils/ApiResponse';

export const requestEarlyAccess = async (c: Context) => {
  try {
    console.log("Early access request:", (await c.req.json()));
    return c.json(ApiResponse.ok("Early access requested"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
