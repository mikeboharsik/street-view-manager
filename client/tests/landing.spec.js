/* eslint-disable testing-library/prefer-screen-queries */
// @ts-check

const { test, expect } = require('@playwright/test');

async function whenUserNavigatesToRootPath(page) {
	await page.goto('http://localhost:3000');
}

async function thenAccessRequestTextIsVisible(page) {
	await expect(page.getByText('This application needs your permission to access the Street View content associated with your Google account')).toBeVisible();
}

async function thenGrantAccessLinkIsVisible(page) {
	await expect(page.getByTestId('link-grant-access')).toBeVisible();
}

async function thenLoaderIsVisible(page) {
	await expect(page.getByTestId('loader-container')).toBeVisible();
}

async function thenLoaderIsNotVisible(page) {
	await expect(page.getByTestId('loader-container')).not.toBeVisible();
}

async function thenLandingHeaderIsVisible(page) {
	await expect(page.getByTestId('landing-header')).toBeVisible();
}

async function thenEditorHeaderIsVisible(page) {
	await expect(page.getByTestId('editor-header')).toBeVisible();
}

async function thenFooterIsVisible(page) {
	await expect(page.getByTestId('footer-container')).toBeVisible();
}

async function thenLogoutButtonIsVisible(page) {
	await expect(page.getByTestId('logout-button')).toBeVisible();
}

async function thenLogoutButtonIsNotVisible(page) {
	await expect(page.getByTestId('logout-button')).not.toBeVisible();
}

async function givenAccessTokenCookieIsVisible(context) {
	await context.addCookies([{ name: 'access_token', value: 'TEST_ACCESS_TOKEN', path: '/', domain: 'localhost' }]);
}

async function thenNoPhotosTextIsVisible(page) {
	await expect(page.getByText('No photos. Go ahead and upload some.')).toBeVisible();
}

async function thenThumbnailsContainerIsVisible(page) {
	await expect(page.getByTestId('thumbnails-container')).toBeVisible();
}

async function thenThumbnailsContainerIsNotVisible(page) {
	await expect(page.getByTestId('thumbnails-container')).not.toBeVisible();
}

async function thenPhotosNavigationContainerIsVisible(page) {
	await expect(page.getByTestId('photos-nav-container')).toBeVisible();
}

async function thenPhotosNavigationContainerIsNotVisible(page) {
	await expect(page.getByTestId('photos-nav-container')).not.toBeVisible();
}

async function thenThumbnailOverlaysAreVisible(page) {
	await expect(page.getByTestId('thumbnail-overlay-container')).toHaveCount(9);
}

async function thenPageCountIsVisible(page) {
	await expect(page.getByText('1 / 1')).toBeVisible();
}

async function givenGitVersionEndpointReturnsMockData(page) {
	await page.route('**/static/version.json', async route => {
		await page.waitForTimeout(100); // necessary for the test to check whether spinner exists
    await route.fulfill({ json: { client: 'some git hash' } });
  });
}

async function givenPhotosEndpointReturnsNoPhotos(page) {
	await page.route('https://streetviewpublish.googleapis.com/v1/photos*', async route => {
		await page.waitForTimeout(500); // necessary for the test to check whether spinner exists
    await route.fulfill({ json: {} });
  });
}

async function givenPhotosEndpointReturnsFiveMockedPhotos(page) {
	await page.route('https://streetviewpublish.googleapis.com/v1/photos*', async route => {
		await page.waitForTimeout(500); // necessary for the test to check whether spinner exists
    await route.fulfill({ json: {
			photos: [
				{ photoId: { id: 'testPhoto1' }, thumbnailUrl: '/mockThumbnailUrl' },
				{ photoId: { id: 'testPhoto2' }, thumbnailUrl: '/mockThumbnailUrl' },
				{ photoId: { id: 'testPhoto3' }, thumbnailUrl: '/mockThumbnailUrl' },
				{ photoId: { id: 'testPhoto4' }, thumbnailUrl: '/mockThumbnailUrl' },
				{ photoId: { id: 'testPhoto5' }, thumbnailUrl: '/mockThumbnailUrl' },
			],
		}});
  });
}

async function givenThumbnailUrlReturnsMockedThumbnail(page) {
	await page.route('**/mockThumbnailUrl', async route => {
    await route.fulfill({ path: './src/images/thumbnail-placeholder.gif' });
  });
}

test.describe('without auth cookie', async () => {
	test.afterEach(async ({ page }) => {
		await page.unrouteAll({ behavior: 'ignoreErrors' });

		await page.reload();
	});

	test.beforeEach(async ({ page }) => {
		await givenGitVersionEndpointReturnsMockData(page);
	});

	test('prompts the user to grant access', async ({ page }) => {
		await whenUserNavigatesToRootPath(page);

		await thenAccessRequestTextIsVisible(page);

		await thenGrantAccessLinkIsVisible(page)
		await thenFooterIsVisible(page);

		await thenLoaderIsNotVisible(page);
		await thenLogoutButtonIsNotVisible(page);
	});
});

test.describe('with auth cookie', async () => {
	test.describe('user has no photos', async () => {
		test.afterEach(async ({ page }) => {
			await page.unrouteAll({ behavior: 'ignoreErrors' });

			await page.reload();
		});

		test.beforeEach(async ({ context, page }) => {
			await givenAccessTokenCookieIsVisible(context);

			await givenGitVersionEndpointReturnsMockData(page);
			await givenPhotosEndpointReturnsNoPhotos(page);
		});
	
		test('loads with no photos', async ({ page }) => {
			await whenUserNavigatesToRootPath(page);

			await thenLoaderIsVisible(page);
			await thenLoaderIsNotVisible(page);
			await thenNoPhotosTextIsVisible(page);
			await thenLandingHeaderIsVisible(page);
			await thenFooterIsVisible(page);
			await thenLogoutButtonIsVisible(page);
			await thenThumbnailsContainerIsNotVisible(page);
			await thenPhotosNavigationContainerIsNotVisible(page);
		});
	});

	test.describe('user has less than one page of photos', async () => {
		test.afterEach(async ({ page }) => {
			await page.unrouteAll({ behavior: 'ignoreErrors' });

			await page.reload();
		});

		test.beforeEach(async ({ context, page }) => {
			await givenAccessTokenCookieIsVisible(context);
	
			await givenGitVersionEndpointReturnsMockData(page);
			
			await givenPhotosEndpointReturnsFiveMockedPhotos(page);
			await givenThumbnailUrlReturnsMockedThumbnail(page);
		});
	
		test('loads with photos', async ({ page }) => {
			await whenUserNavigatesToRootPath(page);
	
			await thenLoaderIsVisible(page);
			await thenLoaderIsNotVisible(page);
			await thenPageCountIsVisible(page);
			await thenLandingHeaderIsVisible(page);
			await thenFooterIsVisible(page);
			await thenLogoutButtonIsVisible(page);
			await thenThumbnailsContainerIsVisible(page);
			await thenPhotosNavigationContainerIsVisible(page);
			await thenThumbnailOverlaysAreVisible(page);
		});
	});
});
