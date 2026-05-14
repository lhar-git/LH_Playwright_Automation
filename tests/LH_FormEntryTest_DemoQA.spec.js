const { test, expect } = require('@playwright/test');

test('LH_FormEntryTest_DemoQA', async ({ page }) => {

    // Increase timeout
    test.setTimeout(60000);

    // Open application
    await page.goto('https://demoqa.com/automation-practice-form');

    // Maximize viewport
    await page.setViewportSize({
        width: 1600,
        height: 1200
    });

    // Remove ads and fixed elements
    await page.evaluate(() => {

        const fixedBan = document.querySelector('#fixedban');
        if (fixedBan) fixedBan.remove();

        const footer = document.querySelector('footer');
        if (footer) footer.remove();

        const ads = document.querySelectorAll('iframe');
        ads.forEach(ad => ad.remove());

    });

    // First Name
    await page.locator('#firstName').fill('Tony');

    // Last Name
    await page.locator('#lastName').fill('Smith');

    // Email
    await page.locator('#userEmail').fill('mary@email.com');

    // Gender
    await page.locator('label[for="gender-radio-2"]').click();

    // Mobile
    await page.locator('#userNumber').fill('9998887777');

    // Date of Birth
    await page.locator('#dateOfBirthInput').click();

    await page.locator('.react-datepicker__year-select')
        .selectOption('1990');

    await page.locator('.react-datepicker__month-select')
        .selectOption('5');

    await page.locator(
        '.react-datepicker__day--014:not(.react-datepicker__day--outside-month)'
    ).click();

  // Subjects
  const subjects = ['Maths', 'English', 'Computer Science'];

  for (const subject of subjects) {

      await page.locator('#subjectsInput').fill(subject);

      // Click dropdown option instead of Enter key
      await page.locator('.subjects-auto-complete__menu-list')
          .locator(`text=${subject}`)
          .click();
  }

    // Hobbies
    await page.locator('#hobbies-checkbox-1').check(); // Sports
    await page.locator('#hobbies-checkbox-3').check(); // Music

    // Address
    await page.locator('#currentAddress')
        .fill('20 Test Street');

    // State
    await page.locator('#state').click();
    await page.locator('#react-select-3-option-0').click();

    // City
    await page.locator('#city').click();
    await page.locator('#react-select-4-option-0').click();

    // Pause 10 seconds before submit
    await page.waitForTimeout(10000);

    // Submit
    await page.locator('#submit').click();

    // Validate successful submission
    await expect(
        page.locator('#example-modal-sizes-title-lg')
    ).toHaveText('Thanks for submitting the form');

    // Pause for demo visibility
    await page.waitForTimeout(5000);

});
