const amqp = require('amqplib');

const rabbitSettings ={
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  vhost: '/',
  authMechanism: ['PLAIN','AMQPLAIN', 'EXTERNAL'],
}

connect();

async function connect(){
  const q = 'employess';
  const msgs=[
    {
      name: 'John',
      enterprise: 'Youtube'
    },
    {
      name: 'Jane',
      enterprise: 'Facebook'
    },
    {
      name: 'Jack',
      enterprise: 'Google'
    },
    {
      name: 'Jill',
      enterprise: 'Youtube'
    },
  ];

  try{
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connected to RabbitMQ');
    const ch = await conn.createChannel();
    await ch.assertQueue(q);
    // await ch.sendToQueue(q, Buffer.from('Hello World!'));
    console.log('Queue created');
    for(let msg in msgs){
      await ch.sendToQueue(q, Buffer.from(JSON.stringify(msgs[msg])));
      console.log('Message sent');
    }

  }catch(err){
    console.log(err);
  }
}