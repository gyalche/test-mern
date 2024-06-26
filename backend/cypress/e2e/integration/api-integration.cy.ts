/// <reference types="cypress" />


describe('API tests', () => {
  let token = '';
  beforeEach(() => {
    cy.request({
      url: `/api/v1/auth/login`,
      form: true,
      body: {
        email: 'dawa.sherpa@esignature.com.np',
        password: 'dawasherpa'
      }
    }).then((response: any) => {
      token = response.body.token;
      cy.log(response.body)
    });
  });

  it('it should POST to do list', () => {
    cy.request({
      method: 'POST',
      url: `task/todo`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: 'mytodo list',
        description: 'complete it with in today',
      },
      failOnStatusCode: false,
    }).then((res: any) => {
      expect(res.status).to.equal(201);
    });
  });

  it('it should GET all post of users', () => {
    cy.request({
      method: 'GET',
      url: `task/todo`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res: any) => {
      expect(res.status).to.equal(200);
    });
  });

  it('it should DELETE todo task', () => {
    cy.request({
      method: 'POST',
      url: `task/todo`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: 'mytodo list',
        description: 'complete it with in today',
      },
    }).then((response: any) => {
      let id = response.id;
      cy.request({
        method: 'DELETE',
        url: `task/todo/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((result) => {
        expect(result.status).to.equal(200);
      });
    });
  });

  it('it should UPDATE todo task', () => {
    cy.request({
      method: 'POST',
      url: `task/todo`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: 'mytodo list',
        description: 'complete it with in today',
      },
    }).then((response: any) => {
      let id = response.id;
      cy.request({
        method: 'UPDATE',
        url: `task/todo/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          title: 'update task',
          description: 'this task should update',
        },
        failOnStatusCode: false,
      }).then((result) => {
        expect(result.status).to.equal(200);
      });
    });
  });
});
