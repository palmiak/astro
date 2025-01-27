import { expect } from 'chai';
import { load as cheerioLoad } from 'cheerio';
import { loadFixture } from './test-utils.js';

describe('Client only components', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/astro-client-only/',
		});
		await fixture.build();
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		// test 1: <astro-island> is empty
		expect($('astro-island').html()).to.equal('');

		// test 2: svelte renderer is on the page
		expect($('astro-island').attr('renderer-url')).to.be.ok;
	});

	it('Adds the CSS to the page', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		const href = $('link[rel=stylesheet]').attr('href');
		const css = await fixture.readFile(href);

		expect(css).to.match(/yellowgreen/, 'Svelte styles are added');
		expect(css).to.match(/Courier New/, 'Global styles are added');
	});

	it('Includes CSS from components that use CSS modules', async () => {
		const html = await fixture.readFile('/css-modules/index.html');
		const $ = cheerioLoad(html);
		expect($('link[rel=stylesheet]')).to.have.a.lengthOf(1);
	});
});

describe('Client only components subpath', () => {
	let fixture;

	before(async () => {
		fixture = await loadFixture({
			site: 'https://site.com',
			base: '/blog',
			root: './fixtures/astro-client-only/',
		});
		await fixture.build();
	});

	it('Loads pages using client:only hydrator', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		// test 1: <astro-island> is empty
		expect($('astro-island').html()).to.equal('');

		// test 2: svelte renderer is on the page
		expect($('astro-island').attr('renderer-url')).to.be.ok;
	});

	it('Adds the CSS to the page', async () => {
		const html = await fixture.readFile('/index.html');
		const $ = cheerioLoad(html);

		const href = $('link[rel=stylesheet]').attr('href');
		const css = await fixture.readFile(href.replace(/\/blog/, ''));

		expect(css).to.match(/yellowgreen/, 'Svelte styles are added');
		expect(css).to.match(/Courier New/, 'Global styles are added');
	});
});
