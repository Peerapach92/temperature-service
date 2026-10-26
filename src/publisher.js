const amqp = require('amqplib');

async function start() {
  const connection = await amqp.connect('amqp://localhost:56730');
  const channel = await connection.createChannel();

  const exchange = 'notifications';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  console.log('Sending temperature every 3 seconds...');

  setInterval(() => {
    const data = {
      sensor_id: 's01',
      temperature: Math.floor(Math.random() * 40),
      timestamp: new Date().toISOString(),
    };

    channel.publish(exchange, '', Buffer.from(JSON.stringify(data)));
    console.log('Sent:', data);
  }, 3000);
}

start().catch((error) => console.log('Publisher error:', error.message));
