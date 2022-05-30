// ---------------------------------------------------------------- //
//                                                                  //
//                 PLEASE DO NOT MODIFY THIS FILE.                  //
//               Hatchways automation depends on it.                //
//                                                                  //
// ---------------------------------------------------------------- //

describe('Onboarding', () => {
  it('Display onboarding after registration', () => {
    cy.interceptRegister();
    cy.interceptGetOnboarding();
    
    cy.visitPath('register');

    cy.get('input[name=username]').type('test');
    cy.get('input[name=email]').type('test@test.com');
    cy.get('input[name=password]').type('password');
    cy.get('input[name=confirmPassword]').type('password');
    cy.contains('button', 'Create').click();

    cy.contains('First Name')
    cy.contains('Last Name')
    cy.contains('Country')
    cy.contains('Bio')
  });
});
