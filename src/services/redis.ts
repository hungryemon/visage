import { updateRedis, getRedis, deleteRedis } from "../helpers/redis";

export const setToRedis = async (
    key: string, 
    value: string, 
    timeInSeconds: number) => {
    await updateRedis(
        { key },
        {
            value,
            expireAt: new Date(Date.parse(Date()) + timeInSeconds * 1000),
        }
    );
}

export const getFromRedis = async (key: string) => {
    try {
        let doc = await getRedis({key});
        if (!doc) throw `Redis item not found: ${key}`;
        const isExpired = Date.parse(doc.expireAt.toISOString())< Date.now();
        if (isExpired) deleteRedis({key});
        return { found: !isExpired, value: doc.value};
   
    }  catch (error) {
        console.log("ERROR getFromRedis", error);
        return { found: false, value: null};
    }
}


export const removeFromRedis = async (key: string) => {
    return deleteRedis({key});
}

