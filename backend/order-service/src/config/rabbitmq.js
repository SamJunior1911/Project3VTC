import amqp from "amqplib";

let connection;
export let channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(process.env.PAYMENT_REQUEST_QUEUE, {
    durable: true,
  });

  await channel.assertQueue(process.env.PAYMENT_RESPONSE_QUEUE, {
    durable: true,
  });

  console.log("RabbitMQ connected");
};

export const sendToQueue = async (queue, message) => {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
