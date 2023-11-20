import { Redis } from "../models/redis";

export const getRedis = async (body: Record<string,any>) => {
    try {
        let data = await Redis.findOne(body);
        return data;
    } catch (error) {
        console.log("ERROR getRedis", error);
        return null;
    }
}

export const updateRedis = async (filter: Object, body: Record<string, any>) => {
    try {
        let data = await Redis.findOneAndUpdate(
            filter, 
            body, {
            upsert: true,
            new: true,
        });
        return data;
    } catch (error) {
        console.log("ERROR updateRedis", error);
        return null; 
    }
}

export const deleteRedis = async (filter: Object,) => {
    try {
        let doc = await Redis.findOne(filter);
        if(doc) {
            await doc.deleteOne();
            return true;
        }
        return false;
    } catch (error) {
        console.log("ERROR deleteRedis", error);
        return null; 
    }
}