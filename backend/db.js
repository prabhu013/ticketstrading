const mongoose = require('mongoose');

const {mongoURI} = process.env;

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  
        console.log('Connected to MongoDB');
  
       
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
  };
  
  async function fetchData() {
    try {
        const fetched_data = mongoose.connection.db.collection("questions");
        const data = await fetched_data.find({}).toArray();
       
        global.questions=data;
       
        console.log('data fetched');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }

module.exports = mongoDB;
