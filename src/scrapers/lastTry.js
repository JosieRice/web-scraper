// @ts-check
import puppeteer from "puppeteer";

export const lastTry = async url => {
  console.log('LAST TRY');
  // TODO: Move this to utilities to be reused
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
      req.abort();
    }
    else {
      req.continue();
    }
  });

  try {
    await page.goto(url);
  } catch (e) {
    console.log('error', e)
  }

  let pageContent;

  try {
    pageContent = await page.evaluate(() =>
      Array.from(document.getElementsByTagName('body'))[0].innerText
    );

    // Cuts page content string off at most common after recipe words
    const afterRecipe = pageContent.indexOf('LEAVE A COMMENT')
    pageContent = pageContent.substring(0, afterRecipe != -1 ? afterRecipe : pageContent.length);

  } catch (e) {
    console.log('error', e)
  }

  if (pageContent) {

    const descriptionIndex = () => {
      const capitalizedIndex = pageContent.indexOf("Description");
      const allCapsIndex = pageContent.indexOf("DESCRIPTION");
      const lowercaseIndex = pageContent.indexOf("description");

      if (capitalizedIndex !== -1) {
        return capitalizedIndex
      } else if (allCapsIndex !== -1) {
        return allCapsIndex
      } else if (lowercaseIndex !== -1) {
        return lowercaseIndex
      } else {
        return 0
      }
    }

    const ingredientsIndex = () => {
      const capitalizedIndex = pageContent.indexOf("Ingredients");
      const allCapsIndex = pageContent.indexOf("INGREDIENTS");
      const lowercaseIndex = pageContent.indexOf("ingredients");

      if (capitalizedIndex !== -1) {
        return capitalizedIndex
      } else if (allCapsIndex !== -1) {
        return allCapsIndex
      } else if (lowercaseIndex !== -1) {
        return lowercaseIndex
      } else {
        return 0
      }
    }

    const instructionsIndex = () => {
      const capitalizedIndex = pageContent.indexOf("Instructions");
      const allCapsIndex = pageContent.indexOf("INSTRUCTIONS");
      const lowercaseIndex = pageContent.indexOf("instructions");

      if (capitalizedIndex !== -1) {
        return capitalizedIndex
      } else if (allCapsIndex !== -1) {
        return allCapsIndex
      } else if (lowercaseIndex !== -1) {
        return lowercaseIndex
      } else {
        return 0
      }
    }

    const afterInstructionsIndex = () => {
      const capitalizedIndex = pageContent.indexOf("About");
      const allCapsIndex = pageContent.indexOf("ABOUT");
      const lowercaseIndex = pageContent.indexOf("about");

      if (capitalizedIndex !== -1) {
        return capitalizedIndex
      } else if (allCapsIndex !== -1) {
        return allCapsIndex
      } else if (lowercaseIndex !== -1) {
        return lowercaseIndex
      } else {
        return 0
      }
    }

    const getDescription = () => {
      if (descriptionIndex() && ingredientsIndex()) {
        return pageContent.substring(
          pageContent.indexOf(descriptionIndex()),
          pageContent.indexOf(ingredientsIndex())
        );
      }
      return "";
    }

    const description = getDescription();

    const getIngredients = () => {
      if (ingredientsIndex() && instructionsIndex()) {
        return pageContent.substring(
          ingredientsIndex(),
          instructionsIndex()
        );
      }
      return ""
    }

    const ingredients = getIngredients();

    const getInstructions = () => {
      if (instructionsIndex() && afterInstructionsIndex()) {
        return pageContent.substring(
          instructionsIndex(),
          afterInstructionsIndex()
        );
      }
      return ""
    }

    const instructions = getInstructions();

    let jsonRecipe = {
      description,
      ingredients,
      instructions
    };

    try {
      await browser.close();
    } catch (e) {
      console.log('error', e)
    }

    return jsonRecipe;
  } else {
    let jsonRecipe = {
      description: "couldn't find anything"
    };
    return jsonRecipe;
  }
};