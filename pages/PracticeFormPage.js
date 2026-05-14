const path = require('path');
const { expect } = require('@playwright/test');

class PracticeFormPage {

    constructor(page) {

        this.page = page;

        // Locators
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.email = page.locator('#userEmail');
        this.mobile = page.locator('#userNumber');
        this.dob = page.locator('#dateOfBirthInput');
        this.address = page.locator('#currentAddress');
        this.uploadPicture = page.locator('#uploadPicture');

        this.submitButton = page.locator('#submit');

        this.successModal =
            page.locator('#example-modal-sizes-title-lg');
    }

    async navigate() {

        await this.page.goto(
            'https://demoqa.com/automation-practice-form'
        );

        await this.page.setViewportSize({
            width: 1600,
            height: 1200
        });

        // Remove ads
        await this.page.evaluate(() => {

            const fixedBan =
                document.querySelector('#fixedban');

            if (fixedBan) fixedBan.remove();

            const footer =
                document.querySelector('footer');

            if (footer) footer.remove();

            const ads =
                document.querySelectorAll('iframe');

            ads.forEach(ad => ad.remove());
        });
    }

    async fillForm(data) {

        // Names
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);

        // Email
        await this.email.fill(data.email);

        // Gender
        await this.page
            .locator(`label[for="gender-radio-${
                data.gender === 'Male' ? '1' : '2'
            }"]`)
            .click();

        // Mobile
        await this.mobile.fill(data.mobile);

        // DOB
        await this.dob.click();

        await this.page
            .locator('.react-datepicker__year-select')
            .selectOption(data.dobYear);

        await this.page
            .locator('.react-datepicker__month-select')
            .selectOption(data.dobMonth);

        await this.page
            .locator(
                `.react-datepicker__day--0${data.dobDay}:not(.react-datepicker__day--outside-month)`
            )
            .click();

        // Subjects
        const subjectInput =
            this.page.locator('#subjectsInput');

        const subjects = data.subjects.split('|');

        for (const subject of subjects) {

            await subjectInput.click();

            await subjectInput.fill(subject);

            await this.page.waitForTimeout(300);

            await subjectInput.press('Enter');
        }

        // Hobbies
        const hobbies = data.hobbies.split('|');

        if (hobbies.includes('Sports')) {

            await this.page
                .locator('#hobbies-checkbox-1')
                .check();
        }

        if (hobbies.includes('Music')) {

            await this.page
                .locator('#hobbies-checkbox-3')
                .check();
        }

        // Upload picture
        const filePath = path.join(
            __dirname,
            `../test-data/images/${data.picture}`
        );

        await this.uploadPicture.setInputFiles(filePath);

        // Address
        await this.address.fill(data.address);

        // State
        await this.page.locator('#state').click();

        await this.page
            .locator('#react-select-3-option-0')
            .click();

        // City
        await this.page.locator('#city').click();

        await this.page
            .locator('#react-select-4-option-0')
            .click();
    }

    async submitForm() {

        await this.submitButton.click();
    }

    async validateSubmission(pictureName) {

        await expect(this.successModal)
            .toHaveText(
                'Thanks for submitting the form'
            );

        const pictureRow = this.page
            .locator('tr')
            .filter({ hasText: 'Picture' });

        await expect(pictureRow)
            .toContainText(pictureName);
    }
}

module.exports = { PracticeFormPage };