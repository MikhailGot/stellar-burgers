describe('Тест конструктора бургеров', () => {
  beforeAll(()=>{
    cy.window().then((win:Window)=>win.localStorage.setItem('refreshToken','TESTTOKEN'));
    cy.setCookie('accessToken', 'ACCESSTOKEN');
  })

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {fixture: 'user.json'}).as('getUser');
    cy.intercept('POST', 'api/orders', {fixture: 'order.json'}).as('createOrder');
  });

  afterAll(() => {
    cy.window().then((win:Window)=>win.localStorage.removeItem('refreshToken'));
    cy.removeCookie('accessToken');
  });

  const ensureConstructorEmpty = () => {
    const burgerConstructor = cy.get('[data-cy="burger-constructor"]');
    burgerConstructor.should('contain','Выберите булки');
    burgerConstructor.should('contain','Выберите начинку');
  }

  const getModal = () => {
    return cy.get('[data-cy="modal"]');
  }

  it('Модальное окно ингредиента', ()=>{
    cy.visit('/');
    const firstIngredient = cy.get('[data-cy="ingredient-card"]').first()
    firstIngredient.click();
    getModal().contains('Ингредиент');
    getModal().get('[data-cy="modal-close-button"]').click();
    cy.contains('[data-cy="modal"]').should('not.exist');
    firstIngredient.click();
    getModal().contains('Ингредиент');
    cy.get('[data-cy="modal-overlay"]').click({force: true});
    getModal().should('not.exist');
  })

  it('Добавление ингредиентов', ()=>{
    cy.visit('/');
    cy.get('[data-cy="ingredient-card"]').eq(0).contains('Добавить').click();
    cy.get('[data-cy="ingredient-card"]').eq(1).contains('Добавить').click();
    cy.get('[data-cy="burger-constructor"]').contains('Выберите булки').should('not.exist');
    cy.get('[data-cy="burger-constructor"]').contains('Выберите начинку').should('not.exist');
  });

  it('Создание бургера', ()=>{
    cy.visit('/');
    ensureConstructorEmpty();
    cy.get('[data-cy="ingredient-card"]').each((el:HTMLElement)=>{
      cy.wrap(el).contains('Добавить').click();
    });
    cy.contains('Оформить заказ').click();
    getModal().contains('12345');
    getModal().contains('Ваш заказ начали готовить');
    cy.get('body').type('{esc}');
    getModal().should('not.exist');
    ensureConstructorEmpty();
  })
});
