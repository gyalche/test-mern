import { getToken } from '../cypress/support/e2e';
describe('API tests', () => {

    let token = ''

    beforeEach(() => {
        cy.request(getToken)
            .then((res: any) => {
                // access the token in your variable
                token = res?.token
            })
    })

    it('it should POST', () => {
        cy.request({
            method: 'POST', url: '/todo-list-create', headers: { Authorization: `Bearer ${token}` }, body: {
                title: 'mytodo list',
                description: 'complete it with in today'
            }
        })
            .then((res) => {
                expect(res.status).to.equal(201)
            })
    })

    it('it should GET all post of users', () => {
        cy.request({ method: 'GET', url: '/get-todo', headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                expect(res.status).to.equal(200)
            })
    })

    it('it should DELETE todo task', () => {
        cy.request({
            method: 'POST', url: '/todo-list-create', headers: { Authorization: `Bearer ${token}` }, body: {
                title: 'mytodo list',
                description: 'complete it with in today'
            }
        })
            .then((response: any) => {
                let id = response.id
                cy.request({ method: 'DELETE', url: `/${id}`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }).then((result) => {
                    expect(result.status).to.equal(200)
                    //other assertions you find convinient
                })
            })
    })

})