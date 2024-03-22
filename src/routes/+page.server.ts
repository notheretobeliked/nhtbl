import type { PostsQuery } from '$lib/generated/graphql';
import HomePageContent from '$lib/graphql/query/homepage.graphql?raw';
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const content = "<p><strong>Not here to be liked</strong> is a digital-first design and strategy studio committed to change through action. </p><p>We help organisations and movements use storytelling, memes and design to shift narratives and move hearts.</p>"
const images = [
	{
		url: '/breakdown/drought_1500.jpg',
		alt: 'weewoo'
	},
	{
		url: '/breakdown/climate-chaos.jpg',
		alt: 'weewoo'
	},
	{
		url: '/breakdown/police2.webp',
		alt: 'weewoo'
	},
	{
		url: '/breakdown/earthonfire.jpeg',
		alt: 'weewoo'
	},	
	{
		url: '/breakdown/forest-fire-lg.jpg',
		alt: 'weewoo'
	},	
	{
		url: '/breakdown/polarbear.avif',
		alt: 'weewoo'
	},	
	{
		url: '/breakdown/bg.jpg',
		alt: 'weewoo'
	},	
	{
		url: '/breakdown/police.jpeg',
		alt: 'weewoo'
	},	
]
export const load: PageServerLoad = async function load({ url }) {
    try {
        const response = await graphqlQuery(HomePageContent, { uri: '/' });
        checkResponse(response)
        const { data }: { data: PostsQuery } = await response.json();
		console.log(data)
        if (!data) {
            throw error(502, 'Unexpected JSON repsonse');
        }

        return {
            images: images,
            content: content,
			data: data
          }


    } catch (err: unknown) {
        const httpError = err as { status: number; message: string };
        if (httpError.message) {
            throw error(httpError.status ?? 500, httpError.message);
        }
        throw error(500, err as string);
    }
};
