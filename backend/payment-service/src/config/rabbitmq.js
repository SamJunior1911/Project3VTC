import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

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
  await channel.assertQueue(process.env.ORDER_UPDATE_QUEUE, { durable: true });

  console.log(" RabbitMQ connected");
};

export const sendToQueue = async (queue, message) => {
  if (!channel) throw new Error("RabbitMQ channel chưa được khởi tạo!");
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`📤 Sent message to [${queue}]`, message);
};

export const receiveFromQueue = async (queue, callback) => {
  if (!channel) throw new Error("RabbitMQ channel chưa được khởi tạo!");

  await channel.assertQueue(queue, { durable: true });

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log(` Nhận message từ [${queue}]:`, content);

          await callback(content);

          channel.ack(msg);
        } catch (error) {
          console.error(" Lỗi khi xử lý message:", error);
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};
