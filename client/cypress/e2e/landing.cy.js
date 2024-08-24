function whenUserNavigatesToRootPath() {
	cy.visit('http://localhost:3000');
}

function thenAccessRequestTextExists() {
	cy.contains('This application needs your permission to access the Street View content associated with your Google account');
}

function thenGrantAccessLinkExists() {
	cy.get('[data-cy="link-grant-access"]').should('exist');
}

function thenLoaderExists() {
	cy.get('#loader-container').should('exist');
}

function thenLoaderDoesNotExist() {
	cy.get('#loader-container').should('not.exist');
}

function thenHeaderClassElementsExists() {
	cy.get('.header').should('exist');
}

function thenFooterExists() {
	cy.get('#footer-container').should('exist');
}

function thenLogoutButtonExists() {
	cy.get('[data-cy="logout-button"]').should('exist');
}

function thenLogoutButtonDoesNotExist() {
	cy.get('[data-cy="logout-button"]').should('not.exist');
}

function givenAccessTokenCookieExists() {
	cy.setCookie('access_token', 'TEST_ACCESS_TOKEN');
}

function thenNoPhotosTextExists() {
	cy.contains('No photos. Go ahead and upload some.');
}

function thenThumbnailsContainerExists() {
	cy.get('#thumbnails-container').should('exist');
}

function thenThumbnailsContainerDoesNotExist() {
	cy.get('#thumbnails-container').should('not.exist');
}

function thenPhotosNavigationContainerExists() {
	cy.get('#photos-nav-container').should('exist');
}

function thenPhotosNavigationContainerDoesNotExist() {
	cy.get('#photos-nav-container').should('not.exist');
}

function thenThumbnailOverlaysExist() {
	cy.get('.thumbnail-overlay-container').should('exist');
}

function thenPageCountExists() {
	cy.contains('1 / 1');
}

function givenGitVersionEndpointReturnsMockData() {
	cy.intercept('GET', '/static/version.json', {
		statusCode: 200,
		body: 'some git hash',
	}).as('gitVersion');
}

function givenPhotosEndpointReturnsNoPhotos() {
	cy.intercept('GET', 'https://streetviewpublish.googleapis.com/v1/photos*', {
		statusCode: 200,
		body: {},
	}).as('photos');
}

function givenPhotosEndpointReturnsFiveMockedPhotos() {
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
}

function givenThumbnailUrlReturnsMockedThumbnail() {
	cy.intercept('GET', '/mockThumbnailUrl', {
		statusCode: 200,
		fixture: '../../src/images/thumbnail-placeholder.gif',
	}).as('mockThumbnail');
}

function whenGitVersionResponseCompletes() {
	cy.wait('@gitVersion');
}

function whenPhotosResponseCompletes() {
	cy.wait('@photos');
}

describe('Landing page', () => {
	describe('without auth cookie', () => {
		afterEach(() => {
			cy.reload();
		});

		it('prompts the user to grant access', () => {
			whenUserNavigatesToRootPath();

			thenAccessRequestTextExists();
			thenGrantAccessLinkExists()
			thenLoaderDoesNotExist();
			thenFooterExists();
			thenLogoutButtonDoesNotExist();
		});
	});

	describe('with auth cookie', () => {
		describe('user has no photos', () => {
			afterEach(() => {
				cy.reload();
			});

			beforeEach(() => {
				givenAccessTokenCookieExists();

				givenGitVersionEndpointReturnsMockData();
				givenPhotosEndpointReturnsNoPhotos();
			});
		
			it('loads with no photos', () => {
				whenUserNavigatesToRootPath();
		
				thenLoaderExists();
		
				whenGitVersionResponseCompletes();
				whenPhotosResponseCompletes();
		
				thenLoaderDoesNotExist();
				thenNoPhotosTextExists();
				thenHeaderClassElementsExists();
				thenFooterExists();
				thenLogoutButtonExists();
				thenThumbnailsContainerDoesNotExist();
				thenPhotosNavigationContainerDoesNotExist();
			});
		});
	
		describe('user has less than one page of photos', () => {
			afterEach(() => {
				cy.reload();
			});

			beforeEach(() => {
				givenAccessTokenCookieExists();
		
				givenGitVersionEndpointReturnsMockData();
				givenPhotosEndpointReturnsFiveMockedPhotos();
				givenThumbnailUrlReturnsMockedThumbnail();
			});
		
			it('loads with photos', () => {
				whenUserNavigatesToRootPath();
		
				thenLoaderExists();
		
				whenGitVersionResponseCompletes();
				whenPhotosResponseCompletes();
		
				thenLoaderDoesNotExist();
				thenPageCountExists();
				thenHeaderClassElementsExists();
				thenFooterExists();
				thenLogoutButtonExists();
				thenThumbnailsContainerExists();
				thenPhotosNavigationContainerExists();
				thenThumbnailOverlaysExist();
			});
		});
	});
});
