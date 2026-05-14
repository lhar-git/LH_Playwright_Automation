const { test } = require('@playwright/test');

const {
    PracticeFormPage
} = require('../pages/PracticeFormPage');

const {
    readCSV
} = require('../utils/csvReader');

test.describe(
    'LH_FormEntryTest_DemoQA',
    () => {

    test.setTimeout(120000);

    let testData;

    test.beforeAll(async () => {

        testData = await readCSV(
            'test-data/csv/formData.csv'
        );
    });

    test(
        'Submit all users from CSV',
        async ({ page }) => {

        const formPage =
            new PracticeFormPage(page);

        for (const data of testData) {

            console.log(
                `Running test for: ${data.firstName} ${data.lastName}`
            );

            await formPage.navigate();

            await formPage.fillForm(data);

            await formPage.submitForm();

            await formPage.validateSubmission(
                data.picture
            );

            // Close modal before next record
            await page.keyboard.press('Escape');
        }
    });
});