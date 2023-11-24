import {connectToDB} from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import {scrapeAmazonProduct} from "@/lib/scraper";
import {getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice} from "@/lib/utils";
import {generateEmailBody, sendEmail} from "@/lib/nodemailer";
import {NextResponse} from "next/server";

export async function GET(){
    try {
     connectToDB();

     const products = await Product.find({});

     if(!products) throw new Error('No products found');

     const updatedProducts = await Promise.all(
         products.map(async (currentProduct) => {

             // first we scrape the product
             const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
             if (!scrapedProduct) throw new Error("No product found");

             const updatedPriceHistory = [
                 ...currentProduct.priceHistory,
                 {price: scrapedProduct.currentPrice}
             ]
             const product = {
                 ...scrapedProduct,
                 priceHistory: updatedPriceHistory,
                 lowestPrice: getLowestPrice(updatedPriceHistory),
                 highestPrice: getHighestPrice(updatedPriceHistory),
                 averagePrice: getAveragePrice(updatedPriceHistory)
             }
             const updatedProduct = await Product.findOneAndUpdate(
                 {url: scrapedProduct.url},
                 product
             )

             // check product status and send email

             const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

             if(emailNotifType && updatedProduct.users.length > 0){
                 const productInfo = {
                     title: updatedProduct.title,
                     url: updatedProduct.url
                 }

                const emailContent = await generateEmailBody(productInfo, emailNotifType);

                 const userEmails = updatedProduct.users.map((user:any) => user.email)

                 await sendEmail(emailContent, userEmails)
             }

             return updatedProduct
         })
     )
        return NextResponse.json({
            message: 'OK', data: updatedProducts
        })
    }catch (error){
        throw new Error(`Failed to get: ${error}`)
    }
}