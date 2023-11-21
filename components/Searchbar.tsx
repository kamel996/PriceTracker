"use client"
import {FormEvent, useState} from "react";
import {scrapeAndStoreProduct} from "@/lib/actions";

const Searchbar = () => {


    const [searchPrompt, setSearchPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)



    const isValidAmazonProductURl = (url: string) => {
        try {
            const parsedUrl = new URL(url)
            const hostname = parsedUrl.hostname;
            if(hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')){
                return true
            }
        } catch (error) {
            return false
        }
    }

    console.log(searchPrompt)

    const handleSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const isValidLink = isValidAmazonProductURl(searchPrompt);

        if(!isValidLink) return alert("Please prove an amazon link")

        try {
            setIsLoading(true)
            const product = await scrapeAndStoreProduct(searchPrompt)
            console.log(product, 'product')
        }catch (error){
            console.log(error)
        }finally {
            setIsLoading(false)
        }

    }



    return (
        <form className="flex flex-wrap gap-5 mt-12" onSubmit={handleSubmit}>
        <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder={"Enter product link"}
            className="searchbar-input"/>

        <button disabled={searchPrompt === ''}  type={"submit"} className="searchbar-btn">
            {isLoading ? "Searching..." : "Search"}
        </button>

        </form>
    )
}

export default Searchbar