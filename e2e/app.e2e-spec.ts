import { YogaPage } from './app.po';

describe('yoga App', () => {
  let page: YogaPage;

  beforeEach(() => {
    page = new YogaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
