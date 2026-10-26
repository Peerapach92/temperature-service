const amqp = require('amqplib');

async function start() {
  const connection = await amqp.connect('amqp://localhost:56730');
  const channel = await connection.createChannel();

  const exchange = 'notifications';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const queue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue.queue, exchange, '');

  console.log('DisplayService is waiting for messages...');

  channel.consume(queue.queue, (message) => {
    const data = JSON.parse(message.content.toString());
    console.log('Temperature:', data.temperature, 'Timestamp:', data.timestamp);
  }, { noAck: true });
}

start().catch((error) => console.log('DisplayService error:', error.message));
