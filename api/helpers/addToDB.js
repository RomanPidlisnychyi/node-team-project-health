const pushDataToDB = async (products) => {
    const result = await productModel.insertMany([
      { name: 'Баклажан', calorie: 320 },
      { name: 'Мясо птицы', calorie: 480 },
      { name: 'Хлеб', calorie: 210 },
      { name: 'Орех', calorie: 205 },
      { name: 'Мясо свиное', calorie: 580 },
      { name: 'Кока кола', calorie: 42 },
      { name: 'Авокадо', calorie: 208 },
      { name: 'Борщ лёгкий', calorie: 60 },
      { name: 'Бублик', calorie: 315 }]
    );
    if (result) {
      console.log("added to DB");
    }
  }

  module.exports = pushDataToDB;