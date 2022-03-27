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
  const enterprise = 'Youtube'
 

  try{
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connected to RabbitMQ');
    const ch = await conn.createChannel();
    await ch.assertQueue(q);
    // await ch.sendToQueue(q, Buffer.from('Hello World!'));
    console.log('Queue created');
    console.log(`Waiting for messages in ${enterprise}`);
    ch.consume(q, (msg) => {
      let employee= JSON.parse(msg.content.toString());
      console.log(`Received message in ${employee.name}`);
      console.log(employee)
      if(employee.enterprise===enterprise){
        ch.ack(msg);
        console.log(`Deleted message in ${employee.name}`);
      }
      else{
        console.log(`Message in ${employee.name} is not from ${enterprise}`);
      }
    }
      );

  }catch(err){
    console.log(err);
  }
}