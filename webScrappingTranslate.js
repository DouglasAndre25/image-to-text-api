const puppeteer = require("puppeteer");
module.exports = async (text) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const formattedText = text.replace(/\r?\n|\r/g, " ")
  var url = `https://translate.google.com.br/?sl=en&tl=pt&text=${encodeURIComponent(
    formattedText
  )}&op=translate`;
  await page.goto(url);
  await page.waitForTimeout(10000);

  const result = await page.evaluate(() => {
    return document.getElementsByClassName("NqnNQd")[0].innerText;
  });

  browser.close();
  return result;
};