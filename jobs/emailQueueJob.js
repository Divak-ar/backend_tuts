import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMail } from "../config/mailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

// Workers
export const handler = new Worker(
  emailQueueName,
  async (job) => {
    console.log("the email worker data is: ", job.data);
    const data = job.data;
    data?.map( async (item) => {
        await sendMail(item.toMail, item.subject, item.body);
    })
  },
  
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

// Worker listeners
handler.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

handler.on("failed", (job) => {
  console.log(`Job with id ${job.id} has failed with ${job.failedReason}`);
});
