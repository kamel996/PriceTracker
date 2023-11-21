import axios from "axios";
import * as cheerio from "cheerio"
import {extractCurrency, extractDescription, extractPrice} from "@/lib/utils";
export async function  scrapeAmazonProduct(url: string){
    if(!url) return;

    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false
    }

    try {
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data)
        const title = $('#productTitle').text().trim()
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('#price_inside_buybox'),

        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );


        const description = extractDescription($)

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images =
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') || '{}';


        const imagesUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        const data = {
            url,
            currency: currency || "$",
            image: imagesUrls[0],
            title,
            description,
            currentPrice: Number(currentPrice),
            originalPrice: Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: '',
            // reviewsCount: null,
            // stars: null,
            isOutOfStock: outOfStock,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            average: Number(originalPrice) || Number(currentPrice),

        }
        console.log(data)
    }catch (error:any){
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
}