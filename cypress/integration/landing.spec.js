describe('Landing page', () => {
	describe('user has no photos', () => {
		beforeEach(() => {
			cy.setCookie('access_token', 'TEST_ACCESS_TOKEN');
	
			cy.intercept('GET', 'http://localhost:3000/git-version.txt', {
				statusCode: 200,
				body: 'some git hash',
			}).as('gitVersion');
	
			cy.intercept('GET', 'https://streetviewpublish.googleapis.com/v1/photos*', {
				statusCode: 200,
				body: {},
			}).as('photos');
		});
	
		it('loads with no photos', () => {
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

	describe('user has less than one page of photos', () => {
		beforeEach(() => {
			cy.setCookie('access_token', 'TEST_ACCESS_TOKEN');
	
			cy.intercept('GET', 'http://localhost:3000/git-version.txt', {
				statusCode: 200,
				body: 'some git hash',
			}).as('gitVersion');
	
			cy.intercept('GET', 'https://streetviewpublish.googleapis.com/v1/photos*', {
				statusCode: 200,
				body: {
					photos: [
						{ photoId: { id: 'testPhoto1' }, thumbnailUrl: '/mockThumbnailUrl' },
						{ photoId: { id: 'testPhoto2' }, thumbnailUrl: '/mockThumbnailUrl' },
						{ photoId: { id: 'testPhoto3' }, thumbnailUrl: '/mockThumbnailUrl' },
						{ photoId: { id: 'testPhoto4' }, thumbnailUrl: '/mockThumbnailUrl' },
						{ photoId: { id: 'testPhoto5' }, thumbnailUrl: '/mockThumbnailUrl' },
					],
				},
			}).as('photos');

			cy.intercept('GET', '/mockThumbnailUrl', {
				statusCode: 200,
				fixture: '../../src/images/thumbnail-placeholder.gif',
			}).as('mockThumbnail');
		});
	
		it('loads with photos', () => {
			cy.visit('http://localhost:3000');
	
			cy.get('#loader-container').should('exist');
	
			cy.wait('@gitVersion');
			cy.wait('@photos');
	
			cy.get('#loader-container').should('not.exist');

			cy.contains('1 / 1');
	
			cy.get('.header').should('exist');
			cy.get('#footer-container').should('exist');
	
			cy.get('#thumbnails-container').should('exist');
			cy.get('#photos-nav-container').should('exist');
		});
	});
});
