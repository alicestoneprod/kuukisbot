fetch("https://blockchain.info/ru/ticker")
  .then((response) => response.json())
  .then((data) => {
    const price = data.RUB.sell
    console.log(price)
  })
  .catch((error) => {
    console.error(error)
  })
