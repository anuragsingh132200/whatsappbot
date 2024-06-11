const {launch}=require("puppeteer")

async function searchMedicine(medicineName) {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  const formattedMedicineName = medicineName.split(" ").join("%20");
  const searchUrl = `https://www.netmeds.com/catalogsearch/result/${formattedMedicineName}/all`;

  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  const result = await page.evaluate(() => {
    const firstProduct = document.querySelector(".ais-InfiniteHits-item");
    if (!firstProduct) return null;

    const productLink = firstProduct.querySelector("a.category_name").href;
    const productName = firstProduct
      .querySelector("h3.clsgetname")
      .innerText.trim();
    const productPrice = firstProduct
      .querySelector(".newbestprice #barBestPrice")
      .innerText.trim()
      .replace("₹", "");

    return {
      productName,
      productPrice,
      productLink,
      siteName: "Netmeds",
    };
  });

  await browser.close();
  return result;
}

module.exports = searchMedicine;