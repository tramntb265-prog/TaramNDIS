import { test as base, expect} from '@playwright/test';
import { LeftMenuPage } from '../pages/leftMenu.page';

type MyFixture = {
    leftMenuPage: LeftMenuPage;
};

export const test = base.extend<MyFixture>({
    leftMenuPage: async ({ page }, use) => {
        const leftMenuPage = new LeftMenuPage(page);
        await page.goto('');
        await leftMenuPage.expectLoaded();
        await use(leftMenuPage);
    },
});