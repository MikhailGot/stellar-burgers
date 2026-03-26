describe('Тест конструктора бургеров', () => {
  before(()=>{
    cy.window().then((win:Window)=>win.localStorage.setItem('refreshToken','TESTTOKEN'));
    cy.setCookie('accessToken', 'ACCESSTOKEN');
  })

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {fixture: 'user.json'}).as('getUser');
    cy.intercept('POST', 'api/orders', {fixture: 'order.json'}).as('createOrder');
  });

  after(() => {
    cy.window().then((win:Window)=>win.localStorage.removeItem('refreshToken'));
    cy.clearCookie('accessToken');
  });

  const ensureConstructorEmpty = () => {
    const burgerConstructor = cy.getConstructor();
    burgerConstructor.should('contain','Выберите булки');
    burgerConstructor.should('contain','Выберите начинку');
  };

  it('Модальное окно ингредиента', ()=>{
    cy.visit('/');
    const firstIngredient = cy.getIngredientCard().first()
    firstIngredient.click();
    cy.getModal().contains('Ингредиент');
    cy.getModalCloseButton().click();
    cy.getModal().should('not.exist');
    firstIngredient.click();
    cy.getModal().contains('Ингредиент');
    cy.getModalOverlay().click({force: true});
    cy.getModal().should('not.exist');
  })

  it('Добавление ингредиентов', ()=>{
    cy.visit('/');
    cy.getIngredientCard().eq(0).contains('Добавить').click();
    cy.getIngredientCard().eq(1).contains('Добавить').click();
    cy.getConstructor().contains('Выберите булки').should('not.exist');
    cy.getConstructor().contains('Выберите начинку').should('not.exist');
  });

  it('Создание бургера', ()=>{
    cy.visit('/');
    ensureConstructorEmpty();
    cy.getIngredientCard().each((el:HTMLElement)=>{
      cy.wrap(el).contains('Добавить').click();
    });
    cy.contains('Оформить заказ').click();
    cy.getModal().contains('12345');
    cy.getModal().contains('Ваш заказ начали готовить');
    cy.get('body').type('{esc}');
    cy.getModal().should('not.exist');
    ensureConstructorEmpty();
  })
});
