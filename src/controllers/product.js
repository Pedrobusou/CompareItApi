const pccomponentes = require('../scrapers/pccomponentes');

const scrapers = {
  pccomponentes: new pccomponentes()
};

async function search(req, res) {
  const searchParams = {
    term: req.params.term,
    shops: ['pccomponentes'] //TODO: get this from req.params
  };

  console.log('searchParams', searchParams);

  /**
   * Perform the search on the specified shops
   * @param {string[]} shops array of shop IDs
   */
  async function getProducts(shops) {
    let products = [],
      scrappedProds = [];

    for (let shopId of shops) {
      try {
        scrappedProds = await scrapers[shopId].getProducts(searchParams.term); //This is returning a string (response obj?)
        products = [...products, scrappedProds]; //TODO: test this: product.push(...scrappedProds);
      } catch (e) {
        console.error(`Error scraping shop ${shopId}:`, e);
      }
    }

    return products;
  }

  let products = [];

  try {
    products = await getProducts(searchParams.shops);
  } catch (e) {
    console.error(e);
  }

  const response = {
    resp: {products},
    msg: ''
  };

  return res.status(200).send(response);
}

module.exports = {
  search
};