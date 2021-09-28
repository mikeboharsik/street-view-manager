describe('Landing page', () => {
	beforeEach(() => {
		cy.setCookie('access_token', 'TEST_ACCESS_TOKEN');

		cy.intercept('GET', 'http://localhost:3000/git-version.txt', {
			statusCode: 200,
			body: 'some git hash',
		}).as('gitVersion');

		cy.intercept('GET', 'https://streetviewpublish.googleapis.com/v1/photos*', {
			statusCode: 200,
			body: {
				nextPageToken: null,
				photos: [],
			},
		}).as('photos');
	});

	it('Loads with no photos', () => {
		cy.visit('http://localhost:3000');

		cy.get('#loader-container').should('exist');

		cy.wait('@gitVersion');
		cy.wait('@photos');

		cy.get('#loader-container').should('not.exist');

		cy.contains('No photos. Go ahead and upload some.');

		cy.get('.header').should('exist');
		cy.get('#footer-container').should('exist');

		cy.get('#thumbnails-container').should('not.exist');
		cy.get('#photos-nav-container').should('not.exist');
	});
});
