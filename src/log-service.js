const fs = require('node:fs');
const amqp = require('amqplib');

async function start() {
  const connection = await amqp.connect('amqp://localhost:56730');
  const channel = await connection.createChannel();

  const exchange = 'notifications';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const queue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue.queue, exchange, '');

  console.log('LogService is waiting for messages...');

  channel.consume(queue.queue, (message) => {
    const data = JSON.parse(message.content.toString());
    const line = `${data.sensor_id}, ${data.temperature}, ${data.timestamp}\n`;

    fs.appendFileSync('temperature.txt', line);
    console.log('Saved to temperature.txt');
  }, { noAck: true });
}

start().catch((error) => console.log('LogService error:', error.message));
