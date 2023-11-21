"use server"

import {scrapeAmazonProduct} from "@/lib/scraper";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) return;

    try {
        const scrapedProduct = await scrapeAmazonProduct(productUrl)
        console.log(scrapedProduct, 'scraped' + '')
    }catch (error: any){
        throw new Error(`Failed because ${error.message}`)
    }
}