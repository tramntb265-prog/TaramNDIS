import { Locator, Page, expect  } from '@playwright/test';
import { ClientsManagePage } from './clients/clientsManage.page';

export class LeftMenuPage {
  readonly page: Page;
  readonly menuContainer: Locator;
  
  readonly dashboardLink: Locator;
  
  readonly clientsMenu: Locator;
  readonly quotesInvoicesMenu: Locator;
  readonly expensesMenu: Locator;
  readonly scheduleMenu: Locator;
  readonly ndisClaimsMenu: Locator;
  readonly inventoryMenu: Locator;
  readonly ndisServicesMenu: Locator;
  readonly staffMenu: Locator;

  readonly accountLink: Locator;
  readonly businessMenu: Locator;
  readonly notificationsLink: Locator;

  readonly appTourLink: Locator;
  readonly feedbackFormLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.menuContainer = page.locator('div.flex.h-full.w-full.flex-col.bg-sidebar');

    this.dashboardLink = this.menuContainer.getByRole('link', { name: 'Dashboard' });
    
    this.clientsMenu = this.menuContainer.getByRole('button', { name: 'Clients' }).or(this.menuContainer.locator('text=Clients'));
    this.quotesInvoicesMenu = this.menuContainer.getByRole('button', { name: 'Quotes & Invoices' }).or(this.menuContainer.locator('text=Quotes & Invoices'));
    this.expensesMenu = this.menuContainer.getByRole('button', { name: 'Expenses' }).or(this.menuContainer.locator('text=Expenses'));
    this.scheduleMenu = this.menuContainer.getByRole('button', { name: 'Schedule' }).or(this.menuContainer.locator('text=Schedule'));
    this.ndisClaimsMenu = this.menuContainer.getByRole('button', { name: 'NDIS Claims' }).or(this.menuContainer.locator('text=NDIS Claims'));
    this.inventoryMenu = this.menuContainer.getByRole('button', { name: 'Inventory' }).or(this.menuContainer.locator('text=Inventory'));
    this.ndisServicesMenu = this.menuContainer.getByRole('button', { name: 'NDIS Services' }).or(this.menuContainer.locator('text=NDIS Services'));
    this.staffMenu = this.menuContainer.getByRole('button', { name: 'Staff' }).or(this.menuContainer.locator('text=Staff'));

    this.accountLink = this.menuContainer.getByRole('link', { name: 'Account' });
    this.businessMenu = this.menuContainer.getByRole('button', { name: 'Business' }).or(this.menuContainer.locator('text=Business'));
    this.notificationsLink = this.menuContainer.getByRole('link', { name: 'Notifications' });

    this.appTourLink = this.menuContainer.getByRole('link', { name: 'Application Tour' });
    this.feedbackFormLink = this.menuContainer.getByRole('link', { name: 'Feedback form' });
  }

  	async expectLoaded(): Promise<void> {
        //not expect all menu just to make sure the stage of it.
		await expect(this.dashboardLink).toBeVisible({ timeout: 15000 });
		await expect(this.accountLink).toBeVisible({ timeout: 15000 });
        await expect(this.businessMenu).toBeVisible({ timeout: 15000 });
	}


  async navigateToDashboard() {
    await this.dashboardLink.click();
  }

  async clickToolsMenu(menuName: 'Clients' | 'Quotes & Invoices' | 'Expenses' | 'Schedule' | 'NDIS Claims' | 'Inventory' | 'NDIS Services' | 'Staff') {
    switch (menuName) {
      case 'Clients': await this.clientsMenu.click(); break;
      case 'Quotes & Invoices': await this.quotesInvoicesMenu.click(); break;
      case 'Expenses': await this.expensesMenu.click(); break;
      case 'Schedule': await this.scheduleMenu.click(); break;
      case 'NDIS Claims': await this.ndisClaimsMenu.click(); break;
      case 'Inventory': await this.inventoryMenu.click(); break;
      case 'NDIS Services': await this.ndisServicesMenu.click(); break;
      case 'Staff': await this.staffMenu.click(); break;
    }
  }


  async navigateToSubmenu(parentMenuName: string, submenuName: string) {
    const parentMenu = this.menuContainer.locator(`text=${parentMenuName}`);
    await parentMenu.click();
    
    const submenuItem = this.menuContainer.locator(`text=${submenuName}`);
    await submenuItem.click();
  }

  async navigateToClientManage(){
    await this.navigateToSubmenu('Clients', 'Manage');
    const clientManage = new ClientsManagePage(this.page);
    clientManage.expectLoaded();
  }

  async navigateToAccount() {
    await this.accountLink.click();
  }

  async clickBusinessSettings() {
    await this.businessMenu.click();
  }

  async navigateToNotifications() {
    await this.notificationsLink.click();
  }

  async openApplicationTour() {
    await this.appTourLink.click();
  }

  async openFeedbackForm() {
    await this.feedbackFormLink.click();
  }
}