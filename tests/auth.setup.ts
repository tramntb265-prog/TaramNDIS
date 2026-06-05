/// <reference types="node" />

import { test as setup, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../src/pages/login/login.page';
import { DashboardPage } from '../src/pages/dashboard/dashboard.page';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Single auth file mapping
const authFile = path.resolve(__dirname, '../auth.json');
const dashboardUrl = 'https://dev.flexigrow.app';
const defaultOtpSecret = 'TEAA3D5E5NDXYKMC';

setup('refresh session or login', async ({ browser }) => {
    setup.setTimeout(2 * 60 * 1000);

    // Initialize context using authFile if it exists
    const context = await browser.newContext({
        storageState: fs.existsSync(authFile) ? authFile : undefined,
    });

    const page = await context.newPage();

    try {
        await ensureSessionAndPersistAuth(page, context);
    } finally {
        await page.goto('about:blank', { waitUntil: 'commit' }).catch(() => {});
        await page.close({ runBeforeUnload: false }).catch(() => {});
        await context.close().catch(() => {});
        console.log('Worker context killed! Releasing thread for functional tests.');
    }
});


async function ensureSessionAndPersistAuth(page: Page, context: BrowserContext): Promise<void> {
    const dashboardPage = new DashboardPage(page);

    if (fs.existsSync(authFile)) {
        try {
            await page.goto(dashboardUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

            //promise.race between dashboardPage url and login url
            //if login wins, continue login flow
            await Promise.race([
                page.waitForURL(/.*\/dashboard.*/, { timeout: 150000 }),
                page.waitForURL(/.*\/login.*/, { timeout: 150000 }),
            ]);
            if (page.url().includes('/dashboard')) {
                await dashboardPage.expectLoaded();
                await context.storageState({ path: authFile });
                console.log('✔ Dashboard loaded from existing session. Auth file refreshed, moving to tests.');
                return;
            } else {
                console.log('Existing session appears to be invalid. Starting login flow to refresh auth file.');
                await loginAndSaveAuth(page, context);
                return;
            }; 
            
        } catch (error) {
            console.log('Session verification timed out or failed. Running fallback login flow.');
        }
    }

}

async function loginAndSaveAuth(page: Page, context: BrowserContext): Promise<void> {
    
    const loginPage = new LoginPage(page);
    console.log('Navigating to login page...');
    await loginPage.expectLoaded()

    await loginPage.emailInput.fill('testy132_16@yopmail.com');
    await loginPage.signInButton.click();
    await loginPage.expectPasswordStep();

    await loginPage.passwordInput.fill('PasswordA@12');
    await loginPage.continueButton.click();

    const otp = await promptOtp();
    await loginPage.otpCodeInput.fill(otp);
    await loginPage.continueButton.click();
    await page.waitForURL(/.*\/dashboard.*/, { timeout: 15000 });
    await loginPage.expectLoggedIn();
    await context.storageState({ path: authFile });
    console.log('✔ Dashboard loaded after MFA. Auth file refreshed, moving to tests.');
}

async function promptOtp(): Promise<string> {

    const otpSecret = (defaultOtpSecret).trim();
    if (otpSecret) {
        return generateTotp(otpSecret);
    }
    
    throw new Error('Unable to obtain OTP.');
}

function generateTotp(secretBase32: string): string {
    const timeStep = 30;
    const digits = 6;
    const counter = Math.floor(Date.now() / 1000 / timeStep);

    const key = base32ToBuffer(secretBase32);
    const msg = Buffer.alloc(8);
    msg.writeBigUInt64BE(BigInt(counter), 0);

    const hmac = crypto.createHmac('sha1', key).update(msg).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

    const otp = (code % 10 ** digits).toString();
    return otp.padStart(digits, '0');
}

function base32ToBuffer(input: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');

    let bits = '';
    for (const char of clean) {
        const val = alphabet.indexOf(char);
        bits += val.toString(2).padStart(5, '0');
    }

    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    return Buffer.from(bytes);
}
