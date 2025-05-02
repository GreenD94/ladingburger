import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://hernandomiguel1994micuenta:ZprJFDl68ifz9CZB@cluster0.ubglb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Cambia esto si tu URI es diferente
const dbName = 'saborea'; // Cambia esto si tu base de datos tiene otro nombre

const ingredients = [
  { name: 'Carne', cost: 2 },
  { name: 'Queso Crema', cost: 1 },
  { name: 'Queso Cheddar', cost: 2 },
  { name: 'Tomate', cost: 0.5 },
  { name: 'Lechuga', cost: 0.5 },
  { name: 'Cebolla', cost: 0.3 },
  { name: 'Cebolla Caramelizada', cost: 0.6 },
  { name: 'BBQ', cost: 0.7 },
  { name: 'Maíz', cost: 0.5 },
  { name: 'Bacon', cost: 1.5 },
  { name: 'Huevo', cost: 1 },
  { name: 'Pepinillos', cost: 0.3 },
  { name: 'Champiñones', cost: 0.8 },
  { name: 'Aguacate', cost: 1.2 },
  { name: 'Pan', cost: 1 },
  { name: 'Salsa Especial', cost: 0.5 }
];

async function seedIngredients() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('ingredients');
    await collection.deleteMany({}); // Limpia la colección antes de insertar
    await collection.insertMany(ingredients);
    console.log('Ingredientes insertados correctamente');
  } catch (err) {
    console.error('Error al insertar ingredientes:', err);
  } finally {
    await client.close();
  }
}

seedIngredients(); 