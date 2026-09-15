import { PrismaClient } from '@prisma/client';

const getPrisma = () => {
  return new PrismaClient();
};

const prisma = new Proxy({}, {
  get: (target, prop) => {
    try {
      const p = getPrisma() as any;
      const value = p[prop];
      if (typeof value === 'function') {
        return value.bind(p);
      }
      return value;
    } catch (err) {
      console.error(`Error in Prisma proxy for prop ${String(prop)}:`, err);
      throw err;
    }
  }
}) as PrismaClient;

async function test() {
  try {
    console.log("Testing jobs access...");
    const jobs = prisma.jobs;
    console.log("jobs is:", !!jobs);
    console.log("Testing count...");
    await jobs.count();
    console.log("Success!");
  } catch (e) {
    console.error("Caught error:", e);
  }
}

test();
