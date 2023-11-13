const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch')

const app = express();

// Load environment variables
require("dotenv").config();

// Access variables
const port = process.env.PORT;
const tokenTTL = process.env.TOKEN_TTL;

app.use(cors())
app.use(bodyParser.json()); 

// Redis for own implementations due to limitations on my end with the OpenShift service
// Redis client
// const redis = require("redis");

// const client = redis.createClient({socket:{ host: "foodle-database", port: 6379 }});

// client.on("error", (err) => console.log("Redis Error", err));

// client.connect();

async function predict(query){
  if(query === null || query === '') return res.status(402)
  const response = await fetch("http://foodle-nlu-model-api:5005/prediction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: query }),
  });
  const prediction = await response.json();
  return(prediction)
}


app.post("/checkout", (req,res) => {
  //Order Service
})


// Root endpoint
app.get("/session", (req, res) => {
  const { v4: uuidv4 } = require("uuid");
  const token = uuidv4();
  const ip = req.ip;
  // client.hSet(token, "ip", ip);
  // client.expire(token, tokenTTL);
  res.status(200).send({token});
});

app.post("/chat", async (req, res) => {
   const token = req.header("Authorization").split(" ")[1];
  // const ttl = await client.ttl(token);
  // if (!ttl || ttl < 0) {
  //   return res.status(401).send("Token expired");
  // }

  const query = req.body.message;
  if(query === null || query === '') return res.status(402)

  const responseA = await fetch("http://foodle-nlu-model-api:5005/model/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query }),
  });
  const predictionA = await responseA.json();
  
  if(predictionA.intent.name === 'order_food'){
    let orderItems = [];
    let quantity = null;
    let dish = null;
    predictionA.entities.forEach(entity => {
      if(entity.entity === 'quantity'){
        quantity = entity.value;
      }
      else if(entity.entity === 'dish'){
        dish = entity.value;
      }
      if(quantity !== null && dish !== null){
        orderItems.push({quantity: quantity, dish: dish})
        dish = null;
        quantity = null;
      }
    });
    const message = "I added it to your order."
    res.status(200).send({message,orderItems})
    return;
  }
  else if(prediction.intent.name === 'track_order'){
    //Tracking service
  }

  const response = await fetch("http:/foodle-nlu-model-api:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: query }),
  });
  const prediction = await response.json();
  const message = prediction[0].text
 res.status(200).send({message})
});

app.get("/menu", (req, res) => {
 
  res.status(200).send([
    [
      "Starters",
      [
        {
          "name": "Caesar Salad",
          "price": 8.5
        },
        {
          "name": "Caprese Bruschetta",
          "price": 10.5
        },
        {
          "name": "Antipasto Platter",
          "price": 14.0
        },
        {
          "name": "Garlic Bread",
          "price": 6.0
        },
        {
          "name": "Mozzarella Sticks",
          "price": 9.5
        },
        {
          "name": "Zuppa Toscana",
          "price": 11.0
        }
      ]
    ],
    [
      "Main Courses",
      [
        {
          "name": "Osso Buco",
          "price": 24.0
        },
        {
          "name": "Lobster Ravioli",
          "price": 22.5
        },
        {
          "name": "Truffle Risotto",
          "price": 18.0
        },
        {
          "name": "Chicken Marsala",
          "price": 20.5
        },
        {
          "name": "Eggplant Parmesan",
          "price": 16.0
        },
        {
          "name": "Shrimp Scampi",
          "price": 26.0
        }
      ]
    ],
    [
      "Desserts",
      [
        {
          "name": "Tiramisu",
          "price": 8.0
        },
        {
          "name": "Panna Cotta",
          "price": 7.5
        },
        {
          "name": "Cannoli",
          "price": 9.0
        },
        {
          "name": "Chocolate Fondant",
          "price": 10.5
        },
        {
          "name": "Lemon Sorbet",
          "price": 6.5
        },
        {
          "name": "Affogato",
          "price": 8.5
        }
      ]
    ],
    [
      "Drinks",
      [
        {
          "name": "Chianti Classico",
          "price": 12.0
        },
        {
          "name": "Limoncello Spritz",
          "price": 9.5
        },
        {
          "name": "Espresso",
          "price": 4.0
        },
        {
          "name": "Bellini",
          "price": 10.0
        },
        {
          "name": "San Pellegrino",
          "price": 5.0
        },
        {
          "name": "Italian Sparkling Wine",
          "price": 15.0
        }
      ]
    ]
  ]
  
  );
});
app.listen(port, () => {
  console.log("API server started on port " + port);
});
