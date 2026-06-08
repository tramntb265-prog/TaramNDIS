import { Page, Locator, expect } from "@playwright/test";
import { DashboardPage } from "../dashboard/dashboard.page";

const LOGIN_URL = 'https://dev.flexigrow.app/login/';

export class LoginPage {
    readonly page: Page;
    readonly loginHeading: Locator;
    readonly emailInput: Locator
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly passwordHeading: Locator;
    readonly continueButton: Locator;
    readonly OtpPageHeading: Locator;
    readonly otpCodeInput: Locator;


    constructor(page: Page) {
        this.page = page;
        this.loginHeading = page.getByRole('heading', { name: 'Welcome to Flexigrow' });
        this.emailInput = page
            .locator('#sign_up_sign_in_credentials_p_email, input[type="email"], input[name*="email" i], input[autocomplete="email"]')
            .first();
        this.passwordInput = page
            .locator('#verify_password_p_password, input[type="password"], input[name*="password" i], input[autocomplete="current-password"]')
            .first();
        this.signInButton = page.getByRole('button', { name: /Sign In|Continue/i }).first();
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
        this.passwordHeading = page.getByRole("heading", { name: "Enter your password" });
        this.OtpPageHeading = page.getByRole("heading", { name: "Verify MFA code" });
        this.otpCodeInput = page.locator('#mfa_authenticator_app_p_verification_code')

    }

    async goto(): Promise<void> {
        await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
        await this.expectLoaded();
    }

    async expectLoaded(): Promise<void> {
        console.log('Waiting for login page to load...');
        await expect(this.loginHeading).toBeVisible({ timeout: 100000 });
        await expect(this.signInButton).toBeVisible({ timeout: 100000 });
        console.log('Login page loaded successfully');
    }

    async expectPasswordStep(): Promise<void> {
        await expect(this.passwordHeading).toBeVisible({ timeout: 100000 });
        await expect(this.passwordInput).toBeVisible({ timeout: 100000 });
        await expect(this.continueButton).toBeVisible({ timeout: 100000 });
    }

    async expectMfaStep(): Promise<void> {
        await expect(this.OtpPageHeading).toBeVisible({ timeout: 100000 });
        await expect(this.otpCodeInput).toBeVisible({ timeout: 100000 });
        await expect(this.continueButton).toBeVisible({ timeout: 100000 });
    }

    async expectLoggedIn(): Promise<void> {
        await expect(this.page).toHaveURL('https://dev.flexigrow.app/dashboards/', { timeout: 100000 });
        const dashboardPage = new DashboardPage(this.page);
        await dashboardPage.expectLoaded();
    }

}