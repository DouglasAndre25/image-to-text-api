const puppeteer = require("puppeteer");

const languageMap = {
  eng: "en",
  por: "pt",
};

module.exports = async (text, { translateTo, originalLang }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  var url = `https://translate.google.com.br/?sl=${languageMap[originalLang]}
  &tl=${languageMap[translateTo]}&text=${encodeURIComponent(
    text
  )}&op=translate`;
  console.log("url", url);
  await page.goto(url);
  await page.waitForTimeout(10000);

  const result = await page.evaluate(() => {
    const elements = Array.from(document.getElementsByClassName("NqnNQd"));
    return elements
      .map((element, index) => (index % 2 === 0 ? element.innerText : ""))
      .join(" ");
  });

  browser.close();
  return result;
};
