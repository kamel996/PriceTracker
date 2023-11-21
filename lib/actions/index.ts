"use server"

import {scrapeAmazonProduct} from "@/lib/scraper";
import {connectToDB} from "@/lib/mongoose";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) return;

    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productUrl)
        if (!scrapedProduct) return ;

    }catch (error: any){
        throw new Error(`Failed because ${error.message}`)
    }
}