import { useContext } from "react";
import authStorage from "../../auth/auth-storage";
import AuthContext from "../../auth/context";
import serverInfo from "../../utility/serverInfo";
import { Filter } from "../../utility/types";
import apiClient from "../client"
import { Listing, WhereQueryOptions } from "./types";

const listings = '/listing';

async function getListings(limit: number, listingsArray?: Listing[],filterO?:Filter){

    const startAt = listingsArray ? listingsArray.length: 0 //where to start querying;
    //console.log(filter)

    const filter = serverInfo.createSeverFilter(filterO)

    return apiClient.get(listings, { offset : startAt, limit, filter } ).then((res)=>{
        return res as any
    })
}

async function getUserListing(){
    const { userId } = await authStorage.getUser();
    return apiClient.get(`/user/${userId}/listings`)
}

function addListing(listing:Listing, onUploadProgress: any, userId: string){
    const data = new FormData()
    data.append('title', listing.title);
    data.append('price', listing.price as any)
    data.append('categoryId', listing.category?.value as any)
    data.append('description', listing.description)
    data.append('userId', userId)
    
    listing.images.forEach((image, index)=>{
        data.append('images',{
            name: 'image' + index,
            type: 'image/jpeg',
            uri: image.uri

        } as any)
    })

    if(listing.location)
        data.append('location', JSON.stringify(listing.location))

    

    return apiClient.post(listings, data, {
        onUploadProgress: progress=>onUploadProgress(progress.loaded / progress.total)
    })
}

export default {
    getListings, addListing, getUserListing
}
