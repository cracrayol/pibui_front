import { PibuiPage } from './app.po';

describe('pibui App', () => {
  let page: PibuiPage;

  beforeEach(() => {
    page = new PibuiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
